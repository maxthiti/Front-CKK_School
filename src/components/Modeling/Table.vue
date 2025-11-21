<template>
    <!-- Desktop View -->
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">ลำดับ</th>
                    <th>ชื่อ-สกุล</th>
                    <th class="text-center">รหัสนักเรียน/รหัสอาจารย์</th>
                    <th class="text-center">ตำแหน่ง</th>
                    <th class="text-center">ห้องเรียน/แผนก</th>
                    <th class="text-center">สถานะ Modeling</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="6" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="(item, index) in data" :key="item._id" class="hover">
                    <td class="text-center">{{ (page - 1) * limit + index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.userid }}</td>
                    <td class="text-center">{{ item.position }}</td>
                    <td class="text-center">
                        <span v-if="item.role === 'student'">
                            {{ item.grade }} / {{ item.classroom }}
                        </span>
                        <span v-else>
                            {{ item.department || '-' }}
                        </span>
                    </td>
                    <td>
                        <div class="flex items-center justify-center gap-2">
                            <div v-for="(model, idx) in item.modeling" :key="idx" class="tooltip tooltip-top"
                                :data-tip="`${model.device.location}`">
                                <div :class="[
                                    'w-3 h-3 rounded-full cursor-help transition-transform hover:scale-125',
                                    model.status === 2
                                        ? 'bg-success'
                                        : model.status === 1
                                            ? 'bg-warning'
                                            : 'bg-error',
                                ]">
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="lg:hidden space-y-4">
        <div v-if="data.length === 0" class="text-center py-8 text-base-content/60 bg-base-100 rounded-lg shadow-lg">
            ไม่พบข้อมูล
        </div>
        <div v-for="(item, index) in data" :key="item._id" class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="badge badge-primary badge-sm mb-2">{{ (page - 1) * limit + index + 1 }}</div>
                    <h3 class="font-bold text-lg">{{ item.name }}</h3>
                    <p class="text-sm text-base-content/70">รหัส: {{ item.userid }}</p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span class="text-base-content/60">ตำแหน่ง:</span>
                    <p class="font-medium">{{ item.position }}</p>
                </div>
                <div>
                    <span class="text-base-content/60">
                        <span v-if="item.role === 'student'">ห้องเรียน:</span>
                        <span v-else>แผนก:</span>
                    </span>
                    <p class="font-medium">
                        <span v-if="item.role === 'student'">
                            {{ item.grade }} / {{ item.classroom }}
                        </span>
                        <span v-else>
                            {{ item.department || '-' }}
                        </span>
                    </p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div>
                <span class="text-sm text-base-content/60 block mb-2">สถานะ Modeling:</span>
                <div class="flex flex-wrap gap-2">
                    <div v-for="(model, idx) in item.modeling" :key="idx" class="tooltip tooltip-top"
                        :data-tip="`${model.device.location}`">
                        <div :class="[
                            'w-4 h-4 rounded-full cursor-help transition-transform hover:scale-125',
                            model.status === 2
                                ? 'bg-success'
                                : model.status === 1
                                    ? 'bg-warning'
                                    : 'bg-error',
                        ]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
    },
    page: {
        type: Number,
        default: 1,
    },
    limit: {
        type: Number,
        default: 10,
    },
});
</script>

<style scoped></style>
