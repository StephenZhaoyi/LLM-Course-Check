import ApplicantListPage from "./ApplicantListPage.stories";

export default {
	title: "Pages/ApplicantListPage",
	component: ApplicantListPage,
	argTypes: {},
};

export const Primary = {
	args: {
		primary: true,
		label: "ApplicantListPage",
	},
};
