import axios from "axios";

export class DepartmentService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getDepartments() {
    try {
      const response = await axios({
        method: "get",
        url: `${this.baseUrl}department`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Get departments error:", error);
      throw error;
    }
  }

  async createDepartment(name) {
    try {
      const response = await axios({
        method: "post",
        url: `${this.baseUrl}department`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        data: { name },
      });
      return response.data;
    } catch (error) {
      console.error("Create department error:", error);
      throw error;
    }
  }

  async deleteDepartment(id) {
    try {
      const response = await axios({
        method: "delete",
        url: `${this.baseUrl}department/${id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Delete department error:", error);
      throw error;
    }
  }
}
