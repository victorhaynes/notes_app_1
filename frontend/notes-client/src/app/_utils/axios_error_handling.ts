
export default function handleResponseError(error: any): string {
  const errorBody = error.response?.data
  let errorMessages = "Registration failed." // Default/Generic
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