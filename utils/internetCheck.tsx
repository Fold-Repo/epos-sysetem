"use client";

import React, { useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const InternetCheck: React.FC = () => {
	const handleToast = useCallback((message: string, type: "warning" | "error") => {
		toast.dismiss();
		toast(message, {
			position: "bottom-center",
			duration: 10000,
		});
	}, []);

	const InternetRestored = useCallback(() => handleToast("Internet Restored 🚀", "warning"), [handleToast]);
	const NoInternetConnection = useCallback(() => handleToast("No/Bad Internet Connection 😭", "error"), [handleToast]);

	useEffect(() => {
		const handleOnlineEvent = () => InternetRestored();
		const handleOfflineEvent = () => NoInternetConnection();

		window.addEventListener("online", handleOnlineEvent);
		window.addEventListener("offline", handleOfflineEvent);

		return () => {
			window.removeEventListener("online", handleOnlineEvent);
			window.removeEventListener("offline", handleOfflineEvent);
		};
	}, [InternetRestored, NoInternetConnection]);

	return null;
};

export default InternetCheck;
