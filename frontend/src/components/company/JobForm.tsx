
import { useForm, FormProvider, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase } from 'lucide-react';
import * as z from 'zod'
import { FormField } from './FormField';
import { RequirementsList } from './Requirements';

const JobSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  activitySector: z.string().min(1, 'Activity sector is required'),
  location: z.string().min(1, 'Location is required'),
  workMode: z.enum(['remote', 'hybrid', 'on-site'], {
    errorMap: () => ({ message: 'Sélectionnez un mode de travail validé' }),
  }),
  requirements:z.array(z.string()).min(1, 'Au moins une compétence est requise'),
  salary: z.number().positive('Salary must be a positive number').optional(),
  minSalary: z.number().positive('minSalary must be a positive number').optional(),
  maxSalary: z.number().positive('maxSalary must be a positive number').optional(),
  experienceLevel: z.enum(['beginner', 'junior', 'senior', 'expert'], {
    errorMap: () => ({ message: "Sélectionnez un niveau d'expérience valide" }),
  }),
  expirationDate: z.string().min(1, 'Expiration date is required').date(),
  jobType: z.enum(['part-time', 'full-time', 'freelance', 'CDI', 'CDD', 'internship', 'CIVP', 'KARAMA'], {
    errorMap: () => ({ message: 'Please select a valid job contract type type' }),
  }),
});
export type JobFormData = z.infer<typeof JobSchema>;

export default function JobForm() {
  const methods = useForm<JobFormData>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      requirements: [''],
      workMode: 'on-site',
      experienceLevel: 'junior',
      jobType: 'full-time',
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = methods;
  const requirements = watch('requirements');

  const onSubmit = (data: JobFormData) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Job Title" error={errors.jobTitle}>
                  <input
                    type="text"
                    {...register('jobTitle')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </FormField>

                <FormField label="Activity Sector" error={errors.activitySector}>
                  <input
                    type="text"
                    {...register('activitySector')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </FormField>

                <FormField label="Location" error={errors.location}>
                  <input
                    type="text"
                    {...register('location')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </FormField>

                <FormField label="Work Mode" error={errors.workMode}>
                  <select
                    {...register('workMode')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </FormField>

                <FormField label="Experience Level" error={errors.experienceLevel}>
                  <select
                    {...register('experienceLevel')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="expert">Expert</option>
                  </select>
                </FormField>

                <FormField label="Job Type" error={errors.jobType}>
                  <select
                    {...register('jobType')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="freelance">Freelance</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="internship">Internship</option>
                    <option value="CIVP">CIVP</option>
                    <option value="KARAMA">KARAMA</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Job Description" error={errors.jobDescription}>
                <textarea
                  {...register('jobDescription')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </FormField>

              <RequirementsList 
                requirements={requirements}
                onChange={(newRequirements) => setValue('requirements', newRequirements)}
                error={errors.requirements as FieldError}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FormField label="Salary (Optional)" error={errors.salary}>
                  <input
                    type="number"
                    {...register('salary', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </FormField>

                <FormField label="Min Salary (Optional)" error={errors.minSalary}>
                  <input
                    type="number"
                    {...register('minSalary', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </FormField>

                <FormField label="Max Salary (Optional)" error={errors.maxSalary}>
                  <input
                    type="number"
                    {...register('maxSalary', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </FormField>
              </div>

              <FormField label="Expiration Date" error={errors.expirationDate}>
                <input
                  type="date"
                  {...register('expirationDate')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </FormField>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Post Job
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}