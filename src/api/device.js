import axios from "axios";

const API_URL = "https://solutiondd.ruijieddns.com/ckk_api/device";

class DeviceService {
  async getDevices() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }

  async createDevice(data) {
    try {
      const formData = new URLSearchParams();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating device:", error);
      throw error;
    }
  }

  async updateDevice(id, data) {
    try {
      const formData = new URLSearchParams();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  }

  async deleteDevice(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  }
}

export default new DeviceService();
