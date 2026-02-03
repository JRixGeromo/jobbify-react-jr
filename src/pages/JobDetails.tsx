import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  MessageCircle,
  CheckSquare,
} from 'lucide-react';
import { Comment, comments as initialComments } from '../data/comments';
import { CommentList } from '../components/comments/CommentList';
import { StatusSelect } from '../components/jobs/StatusSelect';
import { TaskList } from '../components/jobs/TaskList';
import { TipTapEditor } from '../components/editor/TipTapEditor';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchJobs } from '@/hooks/useFetchJobs';
import { Job, JobNew, Task } from '@/types/jobs';

function JobDetails() {
  const { companyId } = useAuth();
  const { clients, loading: clientsLoading } = useFetchClients(companyId);
  const { jobs: initialJobs, loading: jobsLoading } = useFetchJobs(companyId);
  const [jobs, setJobs] = useState<JobNew[]>([]);
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);
  const client = job ? clients.find((c) => c.id === job.clients.id) : null;
  const [comments, setComments] = useState<Comment[]>(
    initialComments.filter((c) => c.jobId === id)
  );

  useEffect(() => {
    if (initialJobs) {
      setJobs(initialJobs);
    }
  }, [initialJobs]);

  if (!job || !client) {
    return <div>Job not found</div>;
  }

  const handleStatusChange = (newStatus: any) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, statuses: newStatus } : j)));
  };

  const handleNotesChange = (newNotes: string) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, notes: newNotes } : j)));
  };

  const handleTasksChange = (newTasks: Task[]) => {
    console.log(newTasks);
    setJobs(
      jobs.map((j) =>
        j.id === id ? { ...j, tasks: JSON.stringify(newTasks) } : j
      )
    );
  };

  const handleAddComment = (content: string, images: string[]) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      jobId: id!,
      userId: 'currentUser',
      content,
      images,
      timestamp: new Date().toISOString(),
      reactions: [],
      replies: [],
    };
    setComments([...comments, newComment]);
  };

  const handleAddReply = (
    commentId: string,
    content: string,
    images: string[]
  ) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now().toString(),
                commentId,
                userId: 'currentUser',
                content,
                images,
                timestamp: new Date().toISOString(),
                reactions: [],
              },
            ],
          };
        }
        return comment;
      })
    );
  };

  const handleReact = (commentId: string, emoji: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions.find(
            (r) => r.emoji === emoji
          );
          if (existingReaction) {
            if (existingReaction.users.includes('currentUser')) {
              return {
                ...comment,
                reactions: comment.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter((u) => u !== 'currentUser'),
                        }
                      : r
                  )
                  .filter((r) => r.count > 0),
              };
            } else {
              return {
                ...comment,
                reactions: comment.reactions.map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count + 1,
                        users: [...r.users, 'currentUser'],
                      }
                    : r
                ),
              };
            }
          } else {
            return {
              ...comment,
              reactions: [
                ...comment.reactions,
                { emoji, count: 1, users: ['currentUser'] },
              ],
            };
          }
        }
        return comment;
      })
    );
  };

  const handleReplyReact = (
    commentId: string,
    replyId: string,
    emoji: string
  ) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                const existingReaction = reply.reactions.find(
                  (r) => r.emoji === emoji
                );
                if (existingReaction) {
                  if (existingReaction.users.includes('currentUser')) {
                    return {
                      ...reply,
                      reactions: reply.reactions
                        .map((r) =>
                          r.emoji === emoji
                            ? {
                                ...r,
                                count: r.count - 1,
                                users: r.users.filter(
                                  (u) => u !== 'currentUser'
                                ),
                              }
                            : r
                        )
                        .filter((r) => r.count > 0),
                    };
                  } else {
                    return {
                      ...reply,
                      reactions: reply.reactions.map((r) =>
                        r.emoji === emoji
                          ? {
                              ...r,
                              count: r.count + 1,
                              users: [...r.users, 'currentUser'],
                            }
                          : r
                      ),
                    };
                  }
                } else {
                  return {
                    ...reply,
                    reactions: [
                      ...reply.reactions,
                      { emoji, count: 1, users: ['currentUser'] },
                    ],
                  };
                }
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
  };

  console.log('Job Notes:', job.notes);
  console.log(`${client.first_name} ${client.last_name}`);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/jobs"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
        <Breadcrumbs />
      </div>

      <div className="space-y-6">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-4">
                <img
                  src={job.image_path}
                  alt={job.services.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {job.services.name}
                  </h1>
                  <p className="text-purple-600">{`${client.first_name} ${client.last_name}`}</p>
                </div>
              </div>
              <StatusSelect
                status={job.statuses.title}
                onChange={handleStatusChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{job.schedule_date}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Clock className="h-5 w-5 mr-3" />
                  {/* <span>{job.schedule_time}</span> */}
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <DollarSign className="h-5 w-5 mr-3" />
                  <span>${job.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <User className="h-5 w-5 mr-3" />
                  <span>{`${client.first_name} ${client.last_name}`}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>{client.phone_number}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{client.email_address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Tasks</h2>
            </div>
          </div>
          <div className="p-6">
            <TaskList
              tasks={JSON.parse(job.tasks)}
              onTasksChange={handleTasksChange}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <h2 className="text-lg font-semibold text-slate-800">Notes</h2>
          </div>
          <div className="p-6">
            <TipTapEditor content={job.notes} onChange={handleNotesChange} />
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Comments</h2>
            </div>
          </div>
          <div className="p-6">
            <CommentList
              comments={comments}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onReact={handleReact}
              onReplyReact={handleReplyReact}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default JobDetails;
