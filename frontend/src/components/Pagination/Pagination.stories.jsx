import React, { useState } from "react";
import Pagination from "./Pagination";

// Default export for Storybook
export default {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered", // Centers the component in the Canvas
  },
  argTypes: {
    totalPages: {
      control: "number",
      description: "Total number of pages",
      defaultValue: 10,
    },
    currentPage: {
      control: "number",
      description: "Current active page",
      defaultValue: 1,
    },
    setCurrentPage: {
      action: "setCurrentPage", // Logs the page change in the Storybook Actions panel
    },
  },
};

// Template to demonstrate usage of the component
const Template = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

// Default Story
export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  currentPage: 1,
};

// Story with More Pages
export const ManyPages = Template.bind({});
ManyPages.args = {
  totalPages: 20,
  currentPage: 1,
};

// Story with Fewer Pages
export const FewPages = Template.bind({});
FewPages.args = {
  totalPages: 5,
  currentPage: 1,
};
