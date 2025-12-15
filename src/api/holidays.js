import axios from "axios";

class HolidaysAPI {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async createHoliday(holidays) {
    try {
      const response = await axios.post(`${this.baseUrl}dayoff`, holidays, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getHolidaysByRange(start, end) {
    try {
      const response = await axios.get(`${this.baseUrl}dayoff`, {
        params: { start, end },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteHoliday(id) {
    try {
      const response = await axios.delete(`${this.baseUrl}dayoff/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export async function fetchExternalHolidays() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const url = baseUrl + "dayoff/calendar";
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
      responseType: "text",
    });
    let data = response.data;
    if (typeof data === "string") {
      data = data.replace(
        /(\"VEVENT\"\s*:\s*\[)([\s\S]*?)(\])/,
        (match, p1, p2, p3) => {
          const fixed = p2.replace(/}\s*{/g, "},{");
          return p1 + fixed + p3;
        }
      );
      data = JSON.parse(data);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export default new HolidaysAPI();
