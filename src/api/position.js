import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export class PositionService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getPositions() {
    try {
      const response = await axios({
        method: "get",
        url: `${this.baseUrl}position`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Get positions error:", error);
      throw error;
    }
  }

  async createPosition(name) {
    try {
      const response = await axios({
        method: "post",
        url: `${this.baseUrl}position`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        data: { name },
      });
      return response.data;
    } catch (error) {
      console.error("Create position error:", error);
      throw error;
    }
  }

  async deletePosition(id) {
    try {
      const response = await axios({
        method: "delete",
        url: `${this.baseUrl}position/${id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Delete position error:", error);
      throw error;
    }
  }
}
