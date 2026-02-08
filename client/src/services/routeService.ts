import { axiosInstance } from "@/lib/axios";

// Match the BusRoute interface from RoutesPage but aligned with backend (MongoDB _id)
export interface RouteData {
    _id: string;
    routeNumber: string;
    origin: string;
    originCoords: { lat: number; lng: number };
    destination: string;
    destinationCoords: { lat: number; lng: number };
    stopsList: { name: string; price: string; lat: number; lng: number }[];
    status: 'Active' | 'Inactive';
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRoutePayload {
    routeNumber: string;
    origin: string;
    originCoords: { lat: number; lng: number };
    destination: string;
    destinationCoords: { lat: number; lng: number };
    stopsList: { name: string; price: string; lat: number; lng: number }[];
    status: 'Active' | 'Inactive';
}

export const getAllRoutes = async () => {
    const response = await axiosInstance.get<RouteData[]>("/routes");
    return response.data;
};

export const getRouteById = async (id: string) => {
    const response = await axiosInstance.get<RouteData>(`/routes/${id}`);
    return response.data;
};

export const createRoute = async (data: CreateRoutePayload) => {
    const response = await axiosInstance.post<RouteData>("/routes", data);
    return response.data;
};

export const updateRoute = async (id: string, data: Partial<CreateRoutePayload>) => {
    const response = await axiosInstance.put<RouteData>(`/routes/${id}`, data);
    return response.data;
};

export const deleteRoute = async (id: string) => {
    const response = await axiosInstance.delete<{ message: string }>(`/routes/${id}`);
    return response.data;
};
