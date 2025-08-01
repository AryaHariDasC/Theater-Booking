import { checkSchema } from 'express-validator';
import { screenModel } from '../model/theatermodel/screenModel';



const theaterRegisterSchema = () => checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Name is required',
        },
    },
    email: {
        isEmail: {
            errorMessage: 'Valid email is required',
        },
    },
    address: {
        notEmpty: {
            errorMessage: 'Address is required',
        },
    },
    phone: {
        isMobilePhone: {
            options: ['en-IN'],
            errorMessage: 'Valid phone number required',
        },
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        }
    },
    NoOfScreen: {
        isInt: {
            options: { min: 1 },
            errorMessage: 'Number of screens must be at least 1',
        },
    },
    dist: {
        notEmpty: {
            errorMessage: 'District is required',
        },
    },
    status: {
        isIn: {
            options: [['open', 'closed']],
            errorMessage: 'Status must be "open" or "closed"',
        },
    },
    pincode: {
        isPostalCode: {
            options: 'IN',
            errorMessage: 'Valid pincode required',
        },
    },
});

export const theaterLoginSchema = ()=> checkSchema({
    email: {
        isEmail: {
            errorMessage: 'Invalid Email'
        }
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long'
        }
    }
})



export const screenCreateValidator =() =>checkSchema({
  screenNo: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Screen number must be a positive integer",
    },
    notEmpty: {
      errorMessage: "Screen number is required",
    },
  },
 
  capacity: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Capacity must be a positive number",
    },
    notEmpty: {
      errorMessage: "Capacity is required",
    },
  },
  NoOfShows: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Number of shows must be at least 1",
    },
    notEmpty: {
      errorMessage: "Number of shows is required",
    },
  },
 
  description: {
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
  },
});




export const createSeatsValidator = () =>
  checkSchema({
    screenId: {
      in: ["body"],
      isMongoId: {
        errorMessage: "screenId must be a valid MongoDB ObjectId"
      },
      notEmpty: {
        errorMessage: "screenId is required"
      }
    },
    silver: {
      in: ["body"],
      isInt: {
        options: { min: 0 },
        errorMessage: "silver must be a non-negative integer"
      },
      notEmpty: {
        errorMessage: "silver seat count is required"
      }
    },
    golden: {
      in: ["body"],
      isInt: {
        options: { min: 0 },
        errorMessage: "golden must be a non-negative integer"
      },
      notEmpty: {
        errorMessage: "golden seat count is required"
      }
    },
    platinum: {
      in: ["body"],
      isInt: {
        options: { min: 0 },
        errorMessage: "platinum must be a non-negative integer"
      },
      notEmpty: {
        errorMessage: "platinum seat count is required"
      }
    },
    recliner: {
      in: ["body"],
      isInt: {
        options: { min: 0 },
        errorMessage: "recliner must be a non-negative integer"
      },
      notEmpty: {
        errorMessage: "recliner seat count is required"
      }
    },
    totalSeatsCheck: {
      custom: {
        options: async (value, { req }) => {
          const { screenId, silver, golden, platinum, recliner } = req.body;

          // Ensure all are numbers
          const silverCount = Number(silver);
          const goldenCount = Number(golden);
          const platinumCount = Number(platinum);
          const reclinerCount = Number(recliner);

          // Fetch screen capacity
          const screen = await screenModel.findById(screenId).select("capacity");

          if (!screen) {
            throw new Error("Screen not found");
          }

          const totalSeats = silverCount + goldenCount + platinumCount + reclinerCount;

          if (totalSeats !== screen.capacity) {
            throw new Error(
              `Total seats (${totalSeats}) must equal screen capacity (${screen.capacity})`
            );
          }

          return true;
        }
      }
    }
  });



export const createMovieValidator = () =>
  checkSchema({
    movie_name: {
      in: ["body"],
      notEmpty: { errorMessage: "Movie name is required" }
    },
    theaterId: {
      in: ["body"],
      isMongoId: { errorMessage: "Valid theaterId is required" }
    },
    screenId: {
      in: ["body"],
      isMongoId: { errorMessage: "Valid screenId is required" }
    },
    showTime: {
      in: ["body"],
      isArray: { errorMessage: "ShowTime must be an array of strings" },
      //  custom: {
      //   options: async (value, { req }) => {
      //     const { screenId } = req.body;
      //     if (!screenId || !Array.isArray(value)) return false;

      //     const available = await isShowTimeAvailable(screenId, value);
      //     if (!available) {
      //       throw new Error("One or more showTimes are already booked on this screen");
      //     }
      //     return true;
      //   }
      // }
    }
  });


export const registerTValidators = (errorFormatter: any) => ({
  theaterRegisterSchemas: [theaterRegisterSchema(), errorFormatter]
});
export const loginTValidators = (errorFormatter: any) => ({
  theaterLoginSchemas: [theaterLoginSchema(), errorFormatter]
});
export const createSValidators = (errorFormatter: any) => ({
  screenCreateValidators: [screenCreateValidator(), errorFormatter]
});
export const createSevalidators=(errorFormatter:any)=>({
  createSeatsValidators:[createSeatsValidator(),errorFormatter]
})
export const createMValidators=(errorFormatter:any)=>({
  createMovieValidators:[createMovieValidator(),errorFormatter]
})