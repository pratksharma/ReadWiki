import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { getTomorrowFeaturedArticleTitle } from "./wikipedia";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const registerForPushNotifications = async () => {
    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        return;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }
};

const scheduleTomorrowFeaturedNotification = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const hasNotification = scheduled.some((notification) => {
        const trigger = notification.trigger;

        if (!trigger || !("date" in trigger)) {
            return false;
        }

        const data = notification.content.data;

        if (data?.type !== "featured-article") {
            return false;
        }

        const date = new Date(trigger.date);

        return (
            date.getFullYear() === tomorrow.getFullYear() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getDate() === tomorrow.getDate() &&
            date.getHours() === 9 &&
            date.getMinutes() === 0
        );
    });

    if (hasNotification) {
        return;
    }

    const title = await getTomorrowFeaturedArticleTitle();

    if (!title) {
        return;
    }

    const triggerDate = new Date();
    triggerDate.setDate(triggerDate.getDate() + 1);
    triggerDate.setHours(9, 0, 0, 0);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: "Tap to read today's featured article.",
            data: {
                type: "featured-article",
                href: `/article/${encodeURIComponent(title)}`,
            },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
        },
    });

    console.log("Scheduled notification for", triggerDate);
};

export const initializeNotifications = async () => {
    await registerForPushNotifications();
    await scheduleTomorrowFeaturedNotification();
};
