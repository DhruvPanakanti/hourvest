// app/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();

  // Handle unauthenticated users
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dark-2">
        <div className="p-8 bg-dark-1 rounded-xl shadow-2xl max-w-md w-full border border-dark-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="rounded-full bg-primary-500 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-light-1"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-light-1">Join Our Community</h1>
            <p className="text-light-2 text-center">
              Create an account to connect with others, share your thoughts, and join the conversation.
            </p>
            <div className="w-full pt-4">
              <Link
                href="/home"
                className="flex justify-center items-center w-full bg-primary-500 hover:bg-primary-600 text-light-1 py-3 px-6 rounded-lg transition-all duration-300 font-medium"
              >
                Click to begin!
              </Link>
              <div className="mt-4 text-center">
                <span className="text-light-3">Already have an account? </span>
                <Link href="/sign-in" className="text-primary-500 hover:text-primary-400 font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has completed onboarding
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Parse page number from search params
  const pageNumber = searchParams?.page 
    ? typeof searchParams.page === 'string' 
      ? parseInt(searchParams.page) 
      : parseInt(searchParams.page[0]) 
    : 1;

  // Fetch posts with pagination
  const result = await fetchPosts(pageNumber, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Appeals found</p>
        ) : (
          result.posts.map((post) => (
            <ThreadCard
              key={post._id.toString()}
              id={post._id.toString()}
              currentUserId={user.id}
              parentId={post.parentId?.toString() || null}
              fullName={post.fullName}
              phoneNo={post.phoneNo}
              email={post.email}
              approvalType={post.approvalType}
              description={post.description}
              timePeriod={post.timePeriod}
              rewards={post.rewards}
              author={{
                name: post.author.name,
                image: post.author.image,
                id: post.author.id  // This should be the Clerk ID, not MongoDB ObjectId
              }}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
              status={post.status}
              acceptedBy={post.acceptedBy ? {
                id: post.acceptedBy.id,  // This should be the Clerk ID, not MongoDB ObjectId
                name: post.acceptedBy.name,
                image: post.acceptedBy.image
              } : null}
            />
          ))
        )}
      </section>
      <Pagination
        path="/"
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </>
  );
}