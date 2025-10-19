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
        :rules="[{ required: true, message: $t('register.form.phone.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          class="cus-input"
          v-model="userInfo.phone"
          :placeholder="$t('register.form.phone.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="email"
        :rules="[{ required: true, message: $t('register.form.email.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          class="cus-input"
          v-model="userInfo.email"
          :placeholder="$t('register.form.email.placeholder')"
        >
          <template #prefix>
            <icon-email />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('register.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          class="cus-input"
          v-model="userInfo.password"
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
        :rules="[{ required: true, message: $t('register.form.repassword.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          class="cus-input"
          v-model="userInfo.repassword"
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
  
        <a-link href="/login" type="text" class="register-form-register-btn">
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
    ],
    password: [
      { required: true, message: t('register.form.password.errMsg') },
    ],
    repassword: [
      { required: true, message: t('register.form.repassword.errMsg') },
      {
        validator: (value: string, cb:any) => {
          if (userInfo.value.password !== value ) {
            cb(t('register.form.repassword.errMsg'))
          } else {
            cb()
          }
        },
      },
    ],
    email: [
      { type: 'email', required: true },
    ],
  });

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
      &:hover{
        background: transparent;
        color: #6250f6;
      }
    }
    .cus-input{
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
      .register-form{
        &-register-btn{
          width: 100%;
        }
      }
    }
  }
</style>
