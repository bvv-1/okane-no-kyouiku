const API_BASE_URL = "https://flask-okane-no-kyouiku.onrender.com/" // "http://127.0.0.1:5000/"

export const getHelloWorldApi = () => {
  return `${API_BASE_URL}`
}

export const postSuggestPlanApi = () => {
	return `${API_BASE_URL}api/v1/plans/suggest`
}
