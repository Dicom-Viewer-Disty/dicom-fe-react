export const login = (user) => {
  localStorage.setItem("USER", user.email);
  localStorage.setItem("TOKEN", user.token);
};

export const logout = () => {
  localStorage.removeItem("USER");
  // localStorage.removeItem("WA");
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("user-detail");
  localStorage.removeItem("page");
  localStorage.removeItem("lat_order");
  localStorage.removeItem("lng_order");
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("lat_destination");
  localStorage.removeItem("path-tambah-pengguna");
  localStorage.removeItem("lng_destination");
  localStorage.removeItem("device_token");
  localStorage.removeItem("cekDirection");
};

export const isLogin = () => {
  if (localStorage.getItem("USER")) {
    return true;
  }
  return false;
};
