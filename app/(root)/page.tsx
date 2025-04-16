// app/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home(props: {
  searchParams: { [key: string]: string | undefined };
}) {
  const searchParams = await props.searchParams;
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dark-2">
        {/* Keep your existing guest view JSX */}
      </div>
    );
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const pageNumber = searchParams?.page ? +searchParams.page : 1;
  const result = await fetchPosts(pageNumber, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          result.posts.map((post) => (
            <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={user.id}
              parentId={post.parentId}
              fullName={post.fullName}
              phoneNo={post.phoneNo}
              email={post.email}
              approvalType={post.approvalType}
              description={post.description}
              timePeriod={post.timePeriod}
              rewards={post.rewards}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
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