const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    signup: async (userData: {
      email: string;
      password: string;
      companyName: string;
      companyWebsite: string;
      intendedUse: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sign up");
      }

      return response.json();
    },

    requestAccess: async (data: { email: string; reason: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/request-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to request access");
      }

      return response.json();
    },

    login: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Login failed");
      return response.json();
    },
    getCurrentUser: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to get user");
      return response.json();
    },
  },
  tiles: {
    getAll: async (params?: { region?: string; country?: string }) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/tiles?${queryString}`);
      return response.json();
    },
    getByBounds: async (bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }) => {
      const queryString = new URLSearchParams(bounds as any).toString();
      const response = await fetch(
        `${API_BASE_URL}/tiles/bounds?${queryString}`
      );
      return response.json();
    },
  },
  orders: {
    createCheckoutSession: async (data: {
      items?: any[];
      credits?: number;
      amount?: number;
      userId: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },
  datasets: {
    createRequest: async (data: {
      dataTypes: string[];
      useCase: string;
      dataSize: string;
      format: string;
      additionalRequirements?: string;
      organization: string;
      email: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/dataset-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit dataset request");
      }

      return response.json();
    },

    getRequests: async () => {
      const response = await fetch(`${API_BASE_URL}/dataset-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch dataset requests");
      }

      return response.json();
    },

    getRequestById: async (requestId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/dataset-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch dataset request");
      }

      return response.json();
    },
  },
  payments: {
    createCheckoutSession: async (data: {
      credits: number;
      amount: number;
      userId: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/payments/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }

      return response.json();
    },
  },
};
