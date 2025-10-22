<template>
  <div class="register-form-wrapper">
    <div class="register-form-title">{{ $t('register.form.title') }}</div>
    <div class="register-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="registerForm"
      :model="userInfo"
      :rules="rules"
      class="register-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="phone"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.phone"
          class="cus-input"
          :placeholder="$t('register.form.phone.placeholder')"
          type="tel"
          inputmode="numeric"
          @input="userInfo.phone = userInfo.phone.replace(/\D/g, '')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="email"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.email"
          class="cus-input"
          :placeholder="$t('register.form.email.placeholder')"
        >
          <template #prefix>
            <icon-email />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          class="cus-input"
          :placeholder="$t('register.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="repassword"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.repassword"
          class="cus-input"
          :placeholder="$t('register.form.repassword.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-row class="grid-demo" justify="space-between">
        <a-button class="custom-btn" html-type="submit" :loading="loading">
          {{ $t('register.form.register') }}
        </a-button>

        <a-link
          type="text"
          class="register-form-register-btn"
          @click="handleRedirectToLoginPage"
        >
          {{ $t('register.form.login') }}
        </a-link>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { RegisterData } from '@/api/auth';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const userInfo = ref({
    phone: '',
    email: '',
    password: '',
    repassword: '',
  });
  const rules = ref({
    phone: [
      { required: true, message: t('register.form.phone.errMsg') },
      {
        validator: (value: string, cb: any) => {
          const phoneRegex =
            /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/;
          if (!phoneRegex.test(value)) {
            cb(t('register.form.phone.notvalid'));
          } else {
            cb();
          }
        },
      },
      { pattern: /^[0-9]+$/, message: t('register.form.phone.errMsg') },
    ],
    password: [
      { required: true, message: t('register.form.password.errMsg') },
      { minLength: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự' },
      {
        validator: (value: string, cb: (error?: string) => void) => {
          if (!value) {
            cb('Vui lòng nhập mật khẩu');
            return;
          }

          if (value.length < 5) {
            cb('Mật khẩu phải có ít nhất 5 ký tự');
            return;
          }

          const hasUpper = /[A-Z]/.test(value);
          const hasLower = /[a-z]/.test(value);
          const hasSpecial = /[\W_]/.test(value);

          if (!hasUpper || !hasLower || !hasSpecial) {
            cb('Phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt');
          } else {
            cb(); // hợp lệ
          }
        },
      },
    ],
    repassword: [
      { required: true, message: t('register.form.repassword.errMsg') },
      {
        validator: (value: string, cb: any) => {
          if (userInfo.value.password !== value) {
            cb(t('register.form.repassword.notmatch'));
          } else {
            cb();
          }
        },
      },
    ],
    email: [
      { required: true, message: t('register.form.email.errMsg') },
      {
        validator: (value: string, cb: any) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            cb(t('register.form.email.notvalid'));
          } else {
            cb();
          }
        },
      },
    ],
  });

  const handleRedirectToLoginPage = () => {
    router.push({ name: 'login' });
  };

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.register(values as RegisterData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'login',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('register.form.success'));
      } catch (err) {
        console.log(err);

        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
</script>

<style lang="less" scoped>
  .register-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
      font-family: 'Roboto Condensed', sans-serif;
      text-transform: uppercase;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    &-register-btn {
      background: #fff;
      color: #a0a0a0;
      font-size: 16px;
      padding: 0 20px;
      height: 40px;
      border-radius: 50px;
      opacity: 0.5;
      &:hover {
        opacity: 1;
        background-color: #6250f6;
        border-color: #6250f6;
        color: #fff;
      }
    }
    .custom-btn {
      background-color: #1a1a1a;
      border-color: #1a1a1a;
      color: #fff;
      font-size: 16px;
      padding: 0 27px;
      height: 40px;
      border-radius: 50px;
      &:hover {
        background-color: #6250f6;
        border-color: #6250f6;
      }
    }
    .forget-password {
      color: #1a1a1a;
      width: 100%;
      margin-bottom: 20px;
      justify-content: start;
      &:hover {
        background: transparent;
        color: #6250f6;
      }
    }
    .cus-input {
      height: 50px;
    }
    @media (max-width: 768px) {
      .custom-btn {
        width: 100%;
        margin-bottom: 10px;
        &:hover {
          background-color: #6250f6;
          border-color: #6250f6;
        }
      }
      .register-form {
        &-register-btn {
          width: 100%;
        }
      }
    }
  }
</style>
