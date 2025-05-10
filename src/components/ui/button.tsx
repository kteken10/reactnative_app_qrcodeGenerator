import React from 'react';
import type { PressableProps } from 'react-native';
import { ActivityIndicator, Pressable} from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';
import { Text, View, } from '@/components/ui';
const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6 text-white',
    icon: 'mr-2', // Nouveau slot pour le style des icônes
  },

  variants: {
    variant: {
      default: {
        container: 'bg-black dark:bg-white',
        label: 'text-white dark:text-black',
        indicator: 'text-white dark:text-black',
        icon: 'text-white dark:text-black',
      },
      secondary: {
        container: 'bg-primary-100 border border-primary-600',
        label: 'text-primary-600',
        indicator: 'text-primary-600',
        icon: 'text-primary-600',
      },
      outline: {
        container: 'border border-neutral-400',
        label: 'text-black dark:text-neutral-100',
        indicator: 'text-black dark:text-neutral-100',
        icon: 'text-black dark:text-neutral-100',
      },
      destructive: {
        container: 'bg-red-600',
        label: 'text-white',
        indicator: 'text-white',
        icon: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-black underline dark:text-white',
        indicator: 'text-black dark:text-white',
        icon: 'text-black dark:text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-black',
        indicator: 'text-black',
        icon: 'text-black',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
        icon: 'size-5',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
        icon: 'size-6',
      },
      md: {
        container: 'h-9 px-4',
        label: 'text-sm',
        icon: 'size-5',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
        icon: 'size-4',
      },
      icon: { 
        container: 'size-9',
        icon: 'size-5',
      },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
        indicator: 'text-neutral-400 dark:text-neutral-400',
        icon: 'text-neutral-400 dark:text-neutral-400',
      },
    },
    fullWidth: {
      true: {
        container: 'w-full',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    const renderContent = () => {
      if (children) return children;
      
      if (loading) {
        return (
          <ActivityIndicator
            size="small"
            className={styles.indicator()}
            testID={testID ? `${testID}-activity-indicator` : undefined}
          />
        );
      }

      return (
        <>
          {icon && iconPosition === 'left' && (
            <View className={styles.icon()}>{icon}</View>
          )}
          {text && (
            <Text
              testID={testID ? `${testID}-label` : undefined}
              className={styles.label({ className: textClassName })}
            >
              {text}
            </Text>
          )}
          {icon && iconPosition === 'right' && (
            <View className={styles.icon()}>{icon}</View>
          )}
        </>
      );
    };

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {renderContent()}
      </Pressable>
    );
  }
);