import { BranchStatus } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  Image as ImageIcon,
  MapPin,
  Phone,
  Save,
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components';
import { DroppableImage } from '@/components/DroppableImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

const branchUpdateSchema = z.object({
  name: z.string().min(1).max(50),
  location: z.string().optional(),
  contact: z.string().optional(),
  logoUrl: z.string().optional(),
});

type BranchUpdateFormData = z.infer<typeof branchUpdateSchema>;

interface BranchSettingsContentProps {
  onCancel: () => void;
}

export function BranchSettingsContent({
  onCancel,
}: BranchSettingsContentProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: branch, isLoading } = useQuery(
    trpc.branch.findOne.queryOptions(
      {
        id: user?.activeBranchId ?? 0,
      },
      {
        enabled: !!user?.activeBranchId,
      }
    )
  );

  const updateBranch = useMutation(
    trpc.branch.update.mutationOptions({
      onSuccess: () => {
        toast.success(t('branchSettings.updateSuccess'));
        onCancel();
      },
      onError: (error) => {
        toast.error(t('branchSettings.updateError'));
        console.error('Branch update error:', error);
      },
    })
  );

  const form = useForm<BranchUpdateFormData>({
    resolver: zodResolver(branchUpdateSchema),
    defaultValues: {
      name: '',
      location: '',
      contact: '',
      logoUrl: '',
    },
  });

  // Update form values when branch data is loaded
  React.useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name,
        location: branch.location || '',
        contact: branch.contact || '',
        logoUrl: branch.logoUrl || '',
      });
    }
  }, [branch, form]);

  const onSubmit = (data: BranchUpdateFormData) => {
    if (!user?.activeBranchId) return;

    updateBranch.mutate({
      id: user.activeBranchId,
      ...data,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-muted h-64 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!branch) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {t('branchSettings.noBranchFound')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div>
            <h2 className="text-xl font-semibold">
              {t('branchSettings.editTitle')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('branchSettings.editDescription')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Building2 className="text-primary h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('branchSettings.sections.basicInformation')}
                </h3>
              </div>

              {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-10"> */}
              <div className="flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="text-muted-foreground h-4 w-4" />
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('branchSettings.form.logo')}
                  </label>
                </div>
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DroppableImage
                          value={field.value}
                          onChange={field.onChange}
                          customSize="!size-[88px] !w-[140px]"
                          uploadText={t('branchSettings.form.uploadLogo')}
                          changeText={t('branchSettings.form.changeLogo')}
                          helpText={t('branchSettings.form.logoHelpText')}
                          previewTitle={t('branchSettings.form.logoPreview')}
                          maxSize={5 * 1024 * 1024} // 5MB for logos
                          accept={{
                            'image/*': [
                              '.jpeg',
                              '.jpg',
                              '.png',
                              '.webp',
                              '.svg',
                            ],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="text-muted-foreground h-4 w-4" />
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('branchSettings.form.name')}
                  </label>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-14"
                          placeholder={t('branchSettings.form.namePlaceholder')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* </div> */}
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('branchSettings.sections.contactInformation')}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('branchSettings.form.location')}
                    </label>
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-14"
                            placeholder={t(
                              'branchSettings.form.locationPlaceholder'
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('branchSettings.form.contact')}
                    </label>
                  </div>
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-14"
                            placeholder={t(
                              'branchSettings.form.contactPlaceholder'
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                className="min-w-[100px]"
                isLoading={updateBranch.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('common.save')}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
