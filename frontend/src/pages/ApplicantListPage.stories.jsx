import ApplicantListPage from "./ApplicantListPage.stories";

// Default export for Storybook
export default {
	title: "Pages/ApplicantListPage",
	component: ApplicantListPage,
	// tags: ["autodocs"],
	// parameters: {
	// 	layout: "fullscreen", // Displays the component in fullscreen mode
	// },
	argTypes: {},
};

export const Primary = {
	args: {
		primary: true,
		label: "ApplicantListPage",
	},
};
