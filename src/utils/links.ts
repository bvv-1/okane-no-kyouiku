const API_BASE_URL = "https://gin-okane-no-kyouiku-api.onrender.com/"

export const getHelloWorldApi = () => {
  return `${API_BASE_URL}`
}

export const postLoginApi = () => {
  return `${API_BASE_URL}api/v2/login`
}

export const postRegisterApi = () => {
  return `${API_BASE_URL}api/v2/register`
}

export const postSubmitGoalAndTaskApi = () => {
  return `${API_BASE_URL}api/v2/goals`
}

export const getSuggestedPlansApi = () => {
  return `${API_BASE_URL}api/v2/plans/suggested`
}

export const putAcceptSuggestedPlansApi = () => {
  return `${API_BASE_URL}api/v2/plans/suggested`
}

export const getCheckProgressApi = () => {
  return `${API_BASE_URL}api/v2/goals/progress`
}

export const getTodayPlanApi = (day: number) => {
  return `${API_BASE_URL}api/v2/plans/today?day=${day}`
}

export const postSubmitTodayProgressApi = () => {
  return `${API_BASE_URL}api/v2/plans/today`
}
