import { movieModel } from "../models/movieModel";
import { screenModel } from "../models/screenModel";
import { theaterModel } from "../models/theaterModel";
import { showModel } from "../models/showModel";
import { checkSchema } from "express-validator";


import mongoose from 'mongoose';
import { createMovieRequest } from "../interface/movieInterface";

const TheaterTValidators = () =>
    checkSchema({
        name: {
            notEmpty: {
                errorMessage: "Name is required",
            },
        },
        address: {
            notEmpty: {
                errorMessage: "Address is required",
            },
        },
        city: {
            notEmpty: {
                errorMessage: "City is required",
            },
        },
        state: {
            notEmpty: {
                errorMessage: "State is required",
            },
        },
        pincode: {
            notEmpty: {
                errorMessage: "Pincode is required",
            },
            isPostalCode: {
                options: "IN",
                errorMessage: "Invalid Indian pincode",
            },
        },
        phone: {
            notEmpty: {
                errorMessage: "Phone number is required",
            },
            custom: {
                options: async (value: any) => {
                    const existingPhone = await theaterModel.findOne({ phoneNo: value })
                    if (existingPhone) {
                        throw new Error('Email already exists');
                    }
                    return true;
                }
            }
        },

        email: {
            notEmpty: {
                errorMessage: "Email is required",
            },
            isEmail: {
                errorMessage: "Invalid email format",
            }, custom: {
                options: async (value: any) => {
                    const existingUser = await theaterModel.findOne({ email: value });
                    if (existingUser) {
                        throw new Error('Email already exists');
                    }
                    return true;
                }
            },
        }
    });


export const ScreenCValidators = () =>
  checkSchema({
    screenNo: {
      notEmpty: {
        errorMessage: "Screen number required",
      },
      custom: {
        options: async (screenNo, { req }) => {
          const theaterId = req.body.theaterId;

          if (!theaterId) {
            throw new Error("Theater ID is required to validate screen number");
          }

          const existingScreen = await screenModel.findOne({ theaterId, screenNo });
          if (existingScreen) {
            throw new Error("Screen number already exists in this theater");
          }

          return true;
        },
      },
    },
    NoOfShows: {
      notEmpty: {
        errorMessage: "Number of shows required",
      },
    },
    showTime: {
      notEmpty: {
        errorMessage: "Show time must required",
      },
    },
    description: {
      notEmpty: {
        errorMessage: "Description required",
      },
    },
    theaterId: {
      notEmpty: {
        errorMessage: "Theater ID is required",
      },
    },
  });


const createOrUpdateSeatValidator = () =>
    checkSchema({
        screenId: {
            notEmpty: {
                errorMessage: "Screen ID is required",
            },
            isMongoId: {
                errorMessage: "Invalid Screen ID format",
            },
            custom: {
                options: async (value: any) => {
                    const screen = await screenModel.findById(value);
                    if (!screen) {
                        throw new Error("Screen not found");
                    }
                    return true
                },
            },
        },
        silver: {
            optional: true,
            isInt: {
                errorMessage: "Silver count must be an integer",
            },
            isNumeric: {
                errorMessage: "Silver count must be a number",
            },
        },
        gold: {
            optional: true,
            isInt: {
                errorMessage: "Gold count must be an integer",
            },
            isNumeric: {
                errorMessage: "Gold count must be a number",
            },
        },
        platinum: {
            optional: true,
            isInt: {
                errorMessage: "Platinum count must be an integer",
            },
            isNumeric: {
                errorMessage: "Platinum count must be a number",
            },
        },
        recliner: {
            optional: true,
            isInt: {
                errorMessage: "Recliner count must be an integer",
            },
            isNumeric: {
                errorMessage: "Recliner count must be a number",
            },
        },
        price: {
            notEmpty: {
                errorMessage: "Price is required",
            },
            isObject: {
                errorMessage: "Price must be an object",
            },
            custom: {
                options: async (value: any) => {
                    if (!value.silverP && !value.goldP && !value.platinumP && !value.reclinerP) {
                        throw new Error("Price object must contain at least one of sliverP, goldP, platinumP, or reclinerP properties");
                    }
                },
            },
        },
    });


const movievalidators = () => checkSchema({
    movie_name: {
        notEmpty: {
            errorMessage: "Movie name is required"
        },
    },
    duration: {
        notEmpty: {
            errorMessage: "Douration is required"
        }
    },
    releaseDate: {
        notEmpty: {
            errorMessage: "Relase date is required"
        }
    },
    status: {
        notEmpty: {
            errorMessage: "Status is required"
        }
    },
    theaterId: {
        notEmpty: {
            errorMessage: "Theater_Id is required"
        },
        
    }
})





export const createOrUpdateShowValidator = () => checkSchema({
    screenId: {
        in: ["body"],
        notEmpty: {
            errorMessage: "screenId is required",
        },
        isMongoId: {
            errorMessage: "screenId must be a valid MongoDB ObjectId",
        },
    },
    movieId: {
        in: ["body"],
        notEmpty: {
            errorMessage: "movieId is required",
        },
        isMongoId: {
            errorMessage: "movieId must be a valid MongoDB ObjectId",
        },
    },
    showTime: {
        in: ["body"],
        notEmpty: {
            errorMessage: "showTime is required",
        },
        isString: {
            errorMessage: "showTime must be a string ",
        },
        custom: {
            options: async (value, { req }) => {
                const { screenId, movieId } = req.body;

                // Only run check if all 3 fields are present and valid
                if (
                    mongoose.Types.ObjectId.isValid(screenId) &&
                    mongoose.Types.ObjectId.isValid(movieId) &&
                    typeof value === "string"
                ) {
                    const duplicateShow = await showModel.findOne({
                        screenId,
                        movieId,
                        showTime: value,
                    });

                    if (duplicateShow) {
                        throw new Error("A show with this movie, screen, and time already exists.");
                    }
                }

                return true;
            },
        },
    },
});




export const createTheaterTValidators = (errorFormatter: any) => ({
    theaterRegisterValidator: [TheaterTValidators(), errorFormatter]
});
export const createScreenSValidators = (errorFormatter: any) => ({
    createScreenValidator: [ScreenCValidators(), errorFormatter]
})
export const seatCreateValidator = (errorFormatter: any) => ({
    seatCreateValidators: [createOrUpdateSeatValidator(), errorFormatter]
})
export const createMovieValidators = (errorFormatter: any) => ({
    createMovieValidator: [movievalidators(), errorFormatter]
})

export const showCreateValidators = (errorFormatter: any) => ({
    showCreateValidator: [createOrUpdateShowValidator(), errorFormatter]
})
