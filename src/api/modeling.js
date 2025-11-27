import axios from "axios";

const API_URL = "https://solutiondd.ruijieddns.com/ckk_api/modeling";

class ModelingService {
  async getModelings(params = {}) {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        role: params.role || "student",
        name: params.name || "",
        department: params.department || "",
        userid: params.userid || "",
        status: params.status || "all",
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await axios.get(`${API_URL}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching modelings:", error);
      throw error;
    }
  }

  async createModeling(data) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating modeling:", error);
      throw error;
    }
  }

  async updateModeling(modelingId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/${modelingId}/remodeling`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating modeling:", error);
      throw error;
    }
  }

  async deleteModeling(modelingId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/${modelingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting modeling:", error);
      throw error;
    }
  }
}

export default new ModelingService();
