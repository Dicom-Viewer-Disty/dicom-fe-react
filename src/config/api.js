export const ConfigPublicApi = {
  headers: {
    Application: "Bearer " + localStorage.getItem("TOKEN"),
  },
};

export const ConfigPrivateApi = () => {};
