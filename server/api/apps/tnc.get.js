const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
  try {

    return {
        statusCode: 200,
        data: config.public.tnc
    };

} catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      //message: "Internal server error",
      message: error.message,
    };
  }
});