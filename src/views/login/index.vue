<template>
    <div class="login-page--container">
        <div class="logo">
            <a-link :hoverable="false" @click="router.push({ name: 'home' })">
                <img src="@/assets/btn-logo.png" alt="Logo" />
            </a-link>
        </div>
        <div class="content">
            <div class="content-inner">
                <LoginForm />
                <div class="content-inner-banner">
                    <img src="@/assets/banner.jpg" alt="Logo" />
                </div>
            </div>
            <div class="footer">
                <Footer />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import Footer from '@/components/footer/index.vue';
    import { useRouter } from 'vue-router';
    import LoginForm from './components/login-form.vue';

    const router = useRouter();
</script>

<style lang="less" scoped>
    .login-page--container {
        display: flex;
        height: 100vh;
        background: url('@/assets/background.jpg') no-repeat center/cover;
        .banner {
            width: 550px;
            background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
        }

        .content {
            position: relative;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            padding-bottom: 40px;
            &-inner {
                width: 100%;
                max-width: 820px;
                background: rgba(255, 255, 255, 0.9);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;

                &-banner {
                    width: 50%;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }
                }
            }
        }
        .login-form-wrapper {
            padding: 48px 40px 32px;
            width: 50%;
        }
        .footer {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
        }
    }

    .logo {
        position: fixed;
        top: 24px;
        left: 22px;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        & img {
            max-width: 130px;
        }
        &-text {
            margin-right: 4px;
            margin-left: 4px;
            color: var(--color-fill-1);
            font-size: 20px;
        }
    }
</style>

<style lang="less" scoped>
    // responsive
    @media (max-width: @screen-lg) {
        .login-page--container {
            .banner {
                width: 25%;
            }
        }
    }
    @media (max-width: 576px) {
        .login-page--container {
            .login-form-wrapper {
                padding: 48px 20px 32px;
                width: 50%;
            }
        }
        .content {
            &-inner {
                &-banner {
                    width: 50%;
                    align-items: stretch;
                }
            }
        }
    }
    @media (max-width: 500px) {
        .content {
            &-inner {
                &-banner {
                    width: 50%;
                    display: none;
                }
            }
        }
        .login-page--container {
            .login-form-wrapper {
                padding: 48px 40px 32px;
                width: 100%;
            }
        }
    }
</style>
