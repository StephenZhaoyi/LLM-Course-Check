import React, { useState } from "react";
import Pagination from "./Pagination";

export default {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
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
      action: "setCurrentPage",
    },
  },
};

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

export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  currentPage: 1,
};

export const ManyPages = Template.bind({});
ManyPages.args = {
  totalPages: 20,
  currentPage: 1,
};

export const FewPages = Template.bind({});
FewPages.args = {
  totalPages: 5,
  currentPage: 1,
};
