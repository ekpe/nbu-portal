import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getUserNotifications } from "@/modules/notifications/services/get-user-notifications";
import { markNotificationReadAction } from "@/modules/notifications/actions/mark-notification-read";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await getUserNotifications(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-gray-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-2xl border bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium">{notification.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                </div>

                {!notification.isRead ? (
                  <form action={markNotificationReadAction}>
                    <input type="hidden" name="id" value={notification.id} />
                    <button className="text-sm text-blue-600 hover:underline">
                      Mark read
                    </button>
                  </form>
                ) : (
                  <span className="text-sm text-gray-400">Read</span>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}