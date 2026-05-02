
self.addEventListener("push", (event) => {
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { title: "Notification", body: "No payload" };
    }

    const title = data.title || "Task Manager";
    const options = {
        body: data.body || "",
        icon: "/icon.png",
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});