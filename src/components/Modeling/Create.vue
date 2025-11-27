<template>
    <div>
        <button @click="openModal" class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            สร้าง Modeling
        </button>

        <dialog ref="modal" class="modal">
            <div class="modal-box max-w-md">
                <h3 class="font-bold text-lg mb-4">สร้าง Modeling</h3>
                <form @submit.prevent="handleSubmit">
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">ประเภท <span class="text-error">*</span></span>
                        </label>
                        <select v-model="formData.option" class="select select-bordered w-full" required>
                            <option value="" disabled>เลือกประเภท</option>
                            <option value="student">นักเรียน</option>
                            <option value="teacher">อาจารย์</option>
                        </select>
                    </div>

                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">เลือกอุปกรณ์ <span class="text-error">*</span></span>
                        </label>
                        <div v-if="loadingDevices" class="flex justify-center py-4">
                            <span class="loading loading-spinner loading-sm"></span>
                        </div>
                        <div v-else class="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                            <label v-for="device in devices" :key="device._id"
                                class="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
                                <input type="checkbox" :value="device._id" v-model="formData.device_id"
                                    class="checkbox checkbox-primary checkbox-sm" />
                                <span class="text-sm">{{ device.location }}</span>
                            </label>
                            <div v-if="devices.length === 0" class="text-center text-sm text-base-content/60 py-4">
                                ไม่พบอุปกรณ์
                            </div>
                        </div>
                        <label class="label">
                            <span class="label-text-alt text-base-content/60">เลือกอุปกรณ์อย่างน้อย 1 รายการ</span>
                        </label>
                    </div>

                    <div class="modal-action">
                        <button type="button" @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
                        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                            {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึก' }}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button type="button" @click="closeModal">close</button>
            </form>
        </dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ModelingService from '../../api/modeling.js';
import DeviceService from '../../api/device.js';
import Swal from 'sweetalert2';

const emit = defineEmits(['created']);

const modal = ref(null);
const isSubmitting = ref(false);
const loadingDevices = ref(false);
const devices = ref([]);

const formData = ref({
    option: 'student',
    device_id: []
});

const openModal = () => {
    modal.value?.showModal();
    loadDevices();
};

const closeModal = () => {
    modal.value?.close();
    resetForm();
};

const resetForm = () => {
    formData.value = {
        option: 'student',
        device_id: []
    };
};

const loadDevices = async () => {
    loadingDevices.value = true;
    try {
        const response = await DeviceService.getDevices();
        if (response.message === 'Success') {
            devices.value = response.data || [];
        }
    } catch (error) {
        console.error('Error loading devices:', error);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้'
        });
    } finally {
        loadingDevices.value = false;
    }
};

const handleSubmit = async () => {
    if (formData.value.device_id.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'แจ้งเตือน',
            text: 'กรุณาเลือกอุปกรณ์อย่างน้อย 1 รายการ'
        });
        return;
    }

    isSubmitting.value = true;
    try {
        const response = await ModelingService.createModeling(formData.value);

        if (response.message === 'Success') {
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'สร้าง Modeling สำเร็จ',
                timer: 1500,
                showConfirmButton: false
            });
            closeModal();
            emit('created');
        }
    } catch (error) {
        console.error('Error creating modeling:', error);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: error.response?.data?.message || 'ไม่สามารถสร้าง Modeling ได้'
        });
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    // Optional: preload devices
});
</script>

<style scoped></style>
