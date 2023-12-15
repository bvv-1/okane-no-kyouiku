const API_BASE_URL = "https://gin-okane-no-kyouiku-api.onrender.com/"

export const getHelloWorldApi = () => {
  return `${API_BASE_URL}`
}

export const postSuggestPlanApi = () => {
	return `${API_BASE_URL}api/v2/plans/suggest`
}

export const postAcceptPlanApi = () => {
	return `${API_BASE_URL}api/v1/plans/accept`
}

export const getGoalApi = () => {
	return `${API_BASE_URL}api/v1/goals`
}

export const getCheckProgressApi = () => {
	return `${API_BASE_URL}api/v1/plans/check`
}

export const postSubmitProgressApi = () => {
	return `${API_BASE_URL}api/v1/plans/submit`
}

export const getTotalProgressApi = () => {
	return `${API_BASE_URL}api/v1/points`
}

export const postTodayPlansApi = () => {
	return `${API_BASE_URL}api/v1/plans/today`
}
