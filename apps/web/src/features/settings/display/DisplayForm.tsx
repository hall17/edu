import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { Layout, Sidebar } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { LoadingButton } from '@/components';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { showSubmittedData } from '@/utils/showSubmittedData';

const getItems = (t: TFunction) =>
  [
    {
      id: 'recents',
      label: t('settings.display.items.recents'),
    },
    {
      id: 'home',
      label: t('settings.display.items.home'),
    },
    {
      id: 'applications',
      label: t('settings.display.items.applications'),
    },
    {
      id: 'desktop',
      label: t('settings.display.items.desktop'),
    },
    {
      id: 'downloads',
      label: t('settings.display.items.downloads'),
    },
    {
      id: 'documents',
      label: t('settings.display.items.documents'),
    },
  ] as const;

const displayFormSchema = (t: TFunction) =>
  z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: t('settings.display.selectAtLeastOneItem'),
    }),
  });

type DisplayFormValues = z.infer<ReturnType<typeof displayFormSchema>>;

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
};

export function DisplayForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const items = getItems(t);
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema(t)),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          setIsLoading(true);
          await showSubmittedData(data);
          setIsLoading(false);
        })}
        className="space-y-8"
      >
        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Sidebar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('settings.display.sidebar')}
            </h3>
          </div>

          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <FormDescription>
                  {t('settings.display.sidebarDescription')}
                </FormDescription>
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-y-0 space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <LoadingButton
            type="submit"
            className="min-w-[100px]"
            isLoading={isLoading}
          >
            {t('common.save')}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
