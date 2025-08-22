
export default function handleResponseError(error: any): string {
  const errorBody = error.response?.data
  const errorStatus = error?.response?.status
  let errorMessages = `An error occured with your request. Code: ${errorStatus}` // Default/Generic
  if (errorBody?.serializer_errors) { // If there are serializer/validation errors in Django I'm sending the default errors inside of a serializer_errors key
    errorMessages = Object.entries(errorBody.serializer_errors)
      .flatMap(([fieldName, fieldErrors]) => {
        return (fieldErrors as string[]).map(individualError => {
          return `${fieldName}: ${individualError}`
        })
      })
      .join(" ")
  }
  return errorMessages
}