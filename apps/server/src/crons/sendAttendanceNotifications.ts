import { logger } from '@api/libs/logger';
import { prisma } from '@api/libs/prisma';
import { AttendanceNotificationType } from '@edusama/common';
import dayjs from 'dayjs';
// import pLimit from 'p-limit';

// const limit = pLimit(10);

export async function sendAttendanceNotifications() {
  logger.info('Sending attendance notifications');

  const classrooms = await prisma.classroom.findMany({
    where: {
      sendNotifications: true,
      attendanceThreshold: {
        not: null,
      },
      reminderFrequency: {
        not: null,
      },
    },
    include: {
      students: {
        include: {
          student: {
            include: {
              attendanceNotifications: true,
              attendanceRecords: true,
            },
          },
        },
      },
      integrations: {
        include: {
          attendanceNotifications: true,
          classroomIntegrationSessions: {
            include: {
              attendanceRecords: {
                include: {
                  student: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const studentsToNotify: {
    student: (typeof classrooms)[number]['students'][number]['student'];
    integration: (typeof classrooms)[number]['integrations'][number];
    notificationType: AttendanceNotificationType;
  }[] = [];

  for (const classroom of classrooms) {
    for (const integration of classroom.integrations) {
      const totalSessionCount = integration.classroomIntegrationSessions.length;
      const notificationThresholdCount = Math.floor(
        totalSessionCount * (classroom.attendanceThreshold! / 100)
      );

      const classroomIntegrationSessionIds =
        integration.classroomIntegrationSessions.map((session) => session.id);

      for (const student of classroom.students) {
        const attendanceRecords = student.student.attendanceRecords.filter(
          (record) =>
            classroomIntegrationSessionIds.includes(
              record.classroomIntegrationSessionId
            )
        );
        const totalPresentCount = attendanceRecords.filter(
          (record) => record.status === 'PRESENT'
        ).length;

        if (totalPresentCount <= notificationThresholdCount) {
          const lastNotification = student.student.attendanceNotifications
            .filter(
              (notification) =>
                notification.notificationType === 'ATTENDANCE_VIOLATION' ||
                notification.notificationType === 'REMINDER'
            )
            .sort(
              (a, b) =>
                new Date(b.notificationDate).getTime() -
                new Date(a.notificationDate).getTime()
            )[0]; // Get the most recent one

          const daysSinceLastNotification = lastNotification
            ? dayjs().diff(dayjs(lastNotification.notificationDate), 'day')
            : Infinity; // If no previous notification, treat as very old

          if (daysSinceLastNotification >= classroom.reminderFrequency!) {
            // Determine notification type based on whether this is first violation or reminder
            const notificationType = lastNotification
              ? 'REMINDER'
              : 'ATTENDANCE_VIOLATION';

            studentsToNotify.push({
              student: student.student,
              integration,
              notificationType,
            });
          }
        }
      }
    }
  }

  logger.info(`Sending ${studentsToNotify.length} attendance notifications`);

  // await prisma.attendanceNotification.createMany({
  //   data: studentsToNotify.map((studentToNotify) => ({
  //     studentId: studentToNotify.student.id,
  //     classroomIntegrationId: studentToNotify.integration.id,
  //     notificationType: studentToNotify.notificationType,
  //     notificationDate: new Date(),
  //   })),
  // });

  // await Promise.all(
  //   studentsToNotify.map(async (studentToNotify) => {
  //     await limit(async () => {
  //       logger.info(
  //         `Sending attendance notifications for student ${studentToNotify.student.email} in integration ${studentToNotify.integration.id}`
  //       );

  //       // TODO: Send notification to the student (email)
  //     });
  //   })
  // );
}
