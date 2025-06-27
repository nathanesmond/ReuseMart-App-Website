import { getMessaging, getToken } from "firebase/messaging";
import { messaging } from "../firebase"; 

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Izin notifikasi diberikan.");

      const token = await getToken(messaging, {
        vapidKey: "BHyH4JNAaNyloTIXURseI0TOnvTUh8x5WVmFNJAFvOlLhL_kw9boLpd87p3srqK4uzTx1MDBSZ059Zj0rSKNILY",
      });

      console.log("FCM Token:", token);
      return token; 
    } else {
      console.log("Izin notifikasi ditolak.");
      return null; 
    }
  } catch (error) {
    console.error("Error saat mendapatkan FCM token:", error);
    return null; 
  }
};