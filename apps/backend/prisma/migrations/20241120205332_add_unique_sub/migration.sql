/*
  Warnings:

  - A unique constraint covering the columns `[worker_id,task_id]` on the table `Submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Submissions_worker_id_task_id_key" ON "Submissions"("worker_id", "task_id");
