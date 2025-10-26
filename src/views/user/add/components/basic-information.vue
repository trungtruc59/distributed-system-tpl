<template>
    <a-form ref="formRef" label-align="left" :label-col-props="{ span: 10, offset: 0 }" :wrapper-col-props="{ span: 24 }" :model="formData" class="form">
        <a-row :gutter="24">
            <a-col :xs="{span: 24, offset: 0}" :sm="{span: 24, offset: 0}" :md="{span: 12, offset: 0}" :lg="{span: 12, offset: 0}">
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
                    <a-input v-model="formData.full_name" :placeholder="'Nhập họ và tên'" />
                </a-form-item>
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
                    ]"
                >
                    <a-input v-model="formData.email" placeholder="Nhập email" />
                </a-form-item>
                
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }" field="birthday" label="Ngày sinh" feedback>
                            <a-date-picker v-model="formData.birthday" :placeholder="'Vui lòng chọn ngày sinh'" style="width: 100%; margin-left: 2px" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item field="gender" label="Giới tính" :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }">
                            <a-cascader
                                v-model="formData.gender"
                                placeholder="Giới tính"
                                style="width: 100%;"
                                :options="[
                                    {
                                        label: 'Nam',
                                        value: 'Nam',
                                    },
                                    {
                                        label: 'Nữ',
                                        value: 'Nữ',
                                    },
                                ]"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="{span: 24, offset: 0}" :sm="{span: 24, offset: 0}" :md="{span: 12, offset: 0}" :lg="{span: 12, offset: 0}">
                <a-form-item label="Ảnh đại diện ( Width:150 - Height:150 )" :label-col-props="{ span: 20 }" :wrapper-col-props="{ span: 20 }">
                    <div class="avatar">
                        <a-image
                            style="margin-right: 20px;"
                            width="150"
                            :src="formData.avatar"
                        />
                    </div>
                    <UploadFile @getUrlImg="handleGetUrlImg" :default-file-list="defaultFileList" />
                </a-form-item>  
               
            </a-col>
        </a-row>

        <a-row :gutter="24" :justify="'center'">
            <a-col style="margin-top: 20px;">
                <a-form-item>
                    <a-space>
                        <a-button v-if="props.userDetail?.id" type="primary" @click="update({ errors: formRef.value?.getFieldsError(), values: formData })"> 
                            Cập nhật thông tin
                        </a-button>
                        <a-button v-else type="primary" @click="validate({ errors: formRef.value?.getFieldsError(), values: formData })">
                            Tạo tài khoản
                        </a-button>
                        <a-button type="secondary" @click="cancelUpdate">
                            Huỷ bỏ
                        </a-button>
                    </a-space>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>

<script lang="ts" setup>
    import { ref, watch, defineProps } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { FormInstance, Message } from '@arco-design/web-vue';
    import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
    import { BasicInfoModel } from '@/api/user-center';
    import UploadFile from '@/components/UploadFile/index.vue';
    import useLoading from '@/hooks/loading';
    import { addAccount, updateAccount, updateUser } from '@/api/user';
    import { accountRequest, User } from '@/types/userTypes';

    const { loading, setLoading } = useLoading();
    const route = useRoute();
    const router = useRouter();
    const { redirect, ...othersQuery } = route.query;
    const formRef = ref<FormInstance>();
    const errorMessage = ref<string>('');
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

    const props = defineProps({
        userDetail: {
            type: Object as () => accountRequest,
            required: false
        },
        id: {
            type: String,
        }
    });
    const handleGetUrlImg = (url: string) => {
        formData.value.avatar = url;
    };

    const validate = async ({ errors, values }: { errors: Record<string, ValidatedError> | undefined; values: Record<string, any> }) => {
        if (loading.value) return;
        if (!errors) {
            setLoading(true);
            try {
                await addAccount(values);
                Message.success('Tạo tài khoản thành công');
                router.push({
                    name: 'UserList',
                    query: {
                        ...othersQuery,
                    },
                });
            } catch (err) {
                console.log(err);

                errorMessage.value = (err as Error).message;
            } finally {
                setLoading(false);
            }
        }
    };

    const update = async ({ errors, values }: { errors: Record<string, ValidatedError> | undefined; values: Record<string, any> }) => {
        if (loading.value) return;
        if (!errors) {
            setLoading(true);
            try {
                await updateUser(props.id ? props.id : '', values);
                Message.success('Cập nhật tài khoản thành công');
                router.push({
                    name: 'List',
                    query: {
                        ...othersQuery,
                    },
                });
            } catch (err) {
                console.log(err);
                errorMessage.value = (err as Error).message;
            } finally {
                setLoading(false);
            }
        }
    };
    const defaultFileList = ref<{ id:string ,name: string; url: string;}[]>([]);
    if (props.userDetail && props.userDetail.userInfo.avatar) {
        defaultFileList.value = [
            {
                id: '1',
                name: 'avatar',
                url: props.userDetail.userInfo.avatar,
            },
        ];
    }
    const cancelUpdate = async () => {
        router.push({
            name: 'List',
            query: {
                ...othersQuery,
            },
        });
    };
    watch(
    () => props.userDetail,
    (newVal) => {
        if (newVal) {
        formData.value = {
            full_name: newVal.userInfo.full_name || '',
            birthday: newVal.userInfo.birthday || '',
            avatar: newVal.userInfo.avatar || '',
            gender: newVal.userInfo.gender || '',
            phone: newVal.phone || '',
            email: newVal.email || '',
            role: newVal.role || '',
            password: '',
        }
        }
    },
    { immediate: true } 
    )
</script>

<style scoped lang="less">
    .form {
        width: 100%;
    }
    .avatar {
        display: flex;
        justify-content: left;
        margin-bottom: 6px;
    }
</style>
