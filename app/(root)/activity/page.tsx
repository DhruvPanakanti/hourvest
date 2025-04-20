import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchUserActivity } from "@/lib/actions/thread.actions";
import Image from "next/image";
import Link from "next/link";
import ApproveAssistanceRequest from "@/components/forms/ApproveAssistanceRequest";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activities = await fetchUserActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          activities.map((activity: any) => (
            <article className="activity-card" key={activity._id}>
              <div className="flex items-start gap-3 w-full">
                <Link href={`/profile/${activity.sender.id}`}>
                  <Image
                    src={activity.sender.image}
                    alt="user_logo"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                </Link>
                
                <div className="flex flex-col flex-1">
                  <p className="!text-small-regular text-light-1">
                    <Link href={`/profile/${activity.sender.id}`}>
                      <span className="mr-1 text-primary-500">
                        {activity.sender.name}
                      </span>
                    </Link>
                    {activity.type === "assist_request" && (
                      <>
                        wants to assist with your request{" "}
                        {activity.thread ? (
                          <Link href={`/thread/${activity.thread._id}`}>
                            <span className="text-primary-500">
                              {activity.thread.fullName || "this request"}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-light-3">[Request unavailable]</span>
                        )}
                      </>
                    )}
                    {activity.type === "assist_approved" && (
                      <>
                        approved your assistance for{" "}
                        {activity.thread ? (
                          <Link href={`/thread/${activity.thread._id}`}>
                            <span className="text-primary-500">
                              {activity.thread.fullName || "this request"}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-light-3">[Request unavailable]</span>
                        )}
                      </>
                    )}
                    {activity.type === "assist_declined" && (
                      <>
                        declined your assistance for{" "}
                        {activity.thread ? (
                          <Link href={`/thread/${activity.thread._id}`}>
                            <span className="text-primary-500">
                              {activity.thread.fullName || "this request"}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-light-3">[Request unavailable]</span>
                        )}
                      </>
                    )}
                    {activity.type === "accept" && (
                      <>
                        accepted your appeal for{" "}
                        {activity.thread ? (
                          <Link href={`/thread/${activity.thread._id}`}>
                            <span className="text-primary-500">
                              {activity.thread.fullName || "this request"}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-light-3">[Appeals unavailable]</span>
                        )}
                      </>
                    )}
                  </p>
                  
                  {/* Show approve/decline buttons only for assistance requests */}
                  {activity.type === "assist_request" && activity.status !== "approved" && activity.status !== "declined" && (
                    <div className="mt-2 flex gap-2">
                      <ApproveAssistanceRequest 
                        activityId={activity._id}
                        threadId={activity.thread?._id}
                        currentUserId={userInfo._id}
                        senderId={activity.sender.id}
                        action="approve"
                      />
                      <ApproveAssistanceRequest 
                        activityId={activity._id}
                        threadId={activity.thread?._id}
                        currentUserId={userInfo._id}
                        senderId={activity.sender.id}
                        action="decline"
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;