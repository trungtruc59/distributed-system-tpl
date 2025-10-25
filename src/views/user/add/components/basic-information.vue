<template>
    <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 19 }">
        <a-form-item
            field="email"
            :label="$t('userSetting.basicInfo.form.label.email')"
            :rules="[
              { required: true, message:'Email không được để trống' },
              {
                  validator: (value: string, cb: any) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(value)) {
                          cb('Email không hợp lệ');
                      } else {
                          cb();
                      }
                  },
              },
            ]">
            <a-input v-model="formData.email" :placeholder="$t('userSetting.basicInfo.placeholder.email')" />
        </a-form-item>
        <a-form-item
            field="full_name"
            :label="'Nhập họ và tên'"
            :rules="[
                {
                    required: true,
                    message: 'Họ và tên không được để trống',
                },
            ]"
        >
            <a-input v-model="formData.full_name" :placeholder="'Vui lòng nhập họ và tên'" />
        </a-form-item>
        <a-form-item
            field="phone"
            :label="'Số điện thoại'"
            :rules="[
                { required: true, message: 'Số điện thoại không được để trống' },
                {
                    validator: (value: string, cb: any) => {
                        const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/;
                        if (!phoneRegex.test(value)) {
                            cb('Số điện thoại không hợp lệ');
                        } else {
                            cb();
                        }
                    },
                },
                { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' },
            ]"
        >
            <a-input v-model="formData.phone" :placeholder="'Vui lòng nhập số điện thoại'" />
        </a-form-item>
        <a-form-item
            field="area"
            :label="$t('userSetting.basicInfo.form.label.area')"
            :rules="[
                {
                    required: true,
                    message: $t('userSetting.form.error.area.required'),
                },
            ]"
        >
            <a-cascader
                v-model="formData.area"
                :placeholder="$t('userSetting.basicInfo.placeholder.area')"
                :options="[
                    {
                        label: '北京',
                        value: 'beijing',
                        children: [
                            {
                                label: '北京',
                                value: 'beijing',
                                children: [
                                    {
                                        label: '朝阳',
                                        value: 'chaoyang',
                                    },
                                ],
                            },
                        ],
                    },
                ]"
                allow-clear
            />
        </a-form-item>
        <a-form-item field="address" :label="$t('userSetting.basicInfo.form.label.address')">
            <a-input v-model="formData.address" :placeholder="$t('userSetting.basicInfo.placeholder.address')" />
        </a-form-item>
        <a-form-item
            field="profile"
            :label="$t('userSetting.basicInfo.form.label.profile')"
            :rules="[
                {
                    maxLength: 200,
                    message: $t('userSetting.form.error.profile.maxLength'),
                },
            ]"
            row-class="keep-margin"
        >
            <a-textarea v-model="formData.profile" :placeholder="$t('userSetting.basicInfo.placeholder.profile')" />
        </a-form-item>
        <a-form-item>
            <a-space>
                <a-button type="primary" @click="validate"> Thêm tài khoản </a-button>
                <a-button type="secondary" @click="reset">
                    {{ $t('userSetting.reset') }}
                </a-button>
            </a-space>
        </a-form-item>
    </a-form>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { FormInstance } from '@arco-design/web-vue';
    import { BasicInfoModel } from '@/api/user-center';

    const formRef = ref<FormInstance>();
    const formData = ref<BasicInfoModel>({
        email: '',
        full_name: '',
        phone: '',
        password: '',
        birthday: '',
        avatar: '',
        gender: '',
        role: '',
    });
    const validate = async () => {
        const res = await formRef.value?.validate();
        if (!res) {
            // do some thing
            // you also can use html-type to submit
        }
    };
    const reset = async () => {
        await formRef.value?.resetFields();
    };
</script>

<style scoped lang="less">
    .form {
        width: 100%;
    }
</style>
