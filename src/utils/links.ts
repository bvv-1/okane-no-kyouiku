const API_BASE_URL = "http://localhost:8080/" // "https://gin-okane-no-kyouiku-api.onrender.com/"

export const getHelloWorldApi = () => {
  return `${API_BASE_URL}`
}

// new

export const postSubmitGoalAndTaskApi = () => {
  return `${API_BASE_URL}api/v1/goals`
}

export const getSuggestedPlansApi = () => {
  return `${API_BASE_URL}api/v1/plans/suggested`
}

export const putAcceptSuggestedPlansApi = () => {
  return `${API_BASE_URL}api/v1/plans/suggested`
}

export const getCheckProgressApi = () => {
  return `${API_BASE_URL}api/v1/goals/progress`
}

export const getTodayPlanApi = (day: number) => {
  return `${API_BASE_URL}api/v2/plans/today?day=${day}`
}

export const postSubmitTodayProgressApi = () => {
  return `${API_BASE_URL}api/v1/plans/today`
}

// old

export const postSuggestPlanApi = () => {
  return `${API_BASE_URL}api/v2/plans/suggest`
}

export const postAcceptPlanApi = () => {
  return `${API_BASE_URL}api/v1/plans/accept`
}

export const getGoalApi = () => {
  return `${API_BASE_URL}api/v1/goals`
}

// export const getCheckProgressApi = () => {
//   return `${API_BASE_URL}api/v1/plans/check`
// }

export const postSubmitProgressApi = () => {
  return `${API_BASE_URL}api/v1/plans/submit`
}

export const getTotalProgressApi = () => {
  return `${API_BASE_URL}api/v1/points`
}

export const postTodayPlansApi = () => {
  return `${API_BASE_URL}api/v1/plans/today`
}
