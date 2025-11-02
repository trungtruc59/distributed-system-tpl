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
                        <a-form-item 
                                field="phone" 
                                :label="'Số điện thoại'"
                                :label-col-props="{ span: 16 }"
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
                                    { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa chữ số' },
                                ]"
                                :validate-trigger="['change', 'blur']" >
                            <a-input
                                v-model="formData.phone"
                                class="cus-input"
                                :placeholder="$t('register.form.phone.placeholder')"
                                type="tel"
                                inputmode="numeric"
                                @input="formData.phone = formData.phone.replace(/\D/g, '')"
                            >
                                <template #prefix>
                                    <icon-user />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            field="password"
                            :label="'Mật khẩu'"
                            :validate-trigger="['change', 'blur']"
                            :rules="[
                                { required: true, message: 'Mật khẩu không được để trống' },
                                { minLength: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự' },
                                {
                                    validator: (value: string, cb: (error?: string) => void) => {
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
                            ]"
                        >
                            <a-input-password
                                v-model="formData.password"
                                :placeholder="'Nhập mật khẩu'"
                                allow-clear
                            >
                                <template #prefix>
                                    <icon-lock />
                                </template>
                            </a-input-password>
                        </a-form-item>
                    </a-col>
                </a-row>
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
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item field="role" label="Phần quyền" :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }">
                            <a-cascader
                                v-model="formData.role"
                                placeholder="Chọn phần quyền"
                                style="width: 100%;"
                                :options="options"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item field="activeBranch" label="Chi nhánh" :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }">
                            <a-cascader
                                v-model="formData.activeBranch"
                                placeholder="Chi nhánh"
                                style="width: 100%;"
                                :options="optBranchs"
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
    import { addAccount, updateAccount, updateUser, getRoles } from '@/api/user';
    import { getUserBranches } from '@/api/branch';
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
        activeBranch: '',
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
    const options = ref<{ label: string; value: string }[]>([]);
    const optBranchs = ref<{ label: string; value: string }[]>([]);
    // Fetch roles for the role selection
    const cloneRoles = async () => {
        setLoading(true);
        try {
            const res = await getRoles();
            const data = 'data' in res ? res.data : res;
            options.value = Array.isArray(data) ? data.map((role: any) => ({ label: role.title, value: role.id })) : [];
            
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    };
    cloneRoles();
    // Fetch branchs for the branch selection
    const cloneBranchs = async () => {
        setLoading(true);
        try {
            const res = await getUserBranches();
            const data = 'data' in res ? res.data : res;
            optBranchs.value = Array.isArray(data) ? data.map((role: any) => ({ label: role.name, value: role.id })) : [];
            
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    };
    cloneBranchs();

    const validate = async ({ errors, values }: { errors: Record<string, ValidatedError> | undefined; values: Record<string, any> }) => {
        if (loading.value) return;
        if (!errors) {
            setLoading(true);
            try {
                await addAccount(values);
                Message.success('Tạo tài khoản thành công');
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

    const update = async ({ errors, values }: { errors: Record<string, ValidatedError> | undefined; values: Record<string, any> }) => {
        if (loading.value) return;
        if (!errors) {
            setLoading(true);
            try {
                await updateAccount(props.id ? props.id : '', values);
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
    if (props.userDetail && props.userDetail.avatar) {
        defaultFileList.value = [
            {
                id: '1',
                name: 'avatar',
                url: props.userDetail.avatar,
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
    const findRoleIdByTitle = (title: string) => {
        const found = options.value.find(r => r.label === title);
        return found ? found.value : '';
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
            role: findRoleIdByTitle(newVal.role) || '',
            activeBranch: newVal.userInfo.activeBranch || '',
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
