<template>
    <div class="flex justify-end mb-2">
        <button class="btn btn-sm btn-success" :disabled="loadingExport" @click="exportLateToExcel">
            <span v-if="loadingExport" class="loading loading-spinner loading-xs mr-2"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            ส่งออก Excel
        </button>
    </div>
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">รหัส</th>
                    <th class="text-center">รูป</th>
                    <th>ชื่อ-สกุล</th>
                    <th class="text-center">ตำแหน่ง</th>
                    <th class="text-center">ชั้นเรียน/แผนก</th>
                    <th class="text-center">เวลา</th>
                    <th class="text-center">เวลาสาย</th>
                    <th class="text-center">รูปภาพ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="8" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="item in data" :key="item._id" class="hover">
                    <td class="text-center">{{ item.userid }}</td>
                    <td class="text-center">
                        <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                            class="w-10 h-10 rounded-full object-cover inline-block cursor-pointer"
                            @click="viewImage(item.picture, true)" />
                        <div v-else class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                            <span class="text-base font-bold">{{ getInitials(item.name) }}</span>
                        </div>
                    </td>
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.position }}</td>
                    <td class="text-center">
                        <span v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{ item.classroom }}</span>
                        <span v-else>-</span>
                    </td>
                    <td class="text-center">
                        <span v-if="item.comming_time" class="badge badge-info badge-sm">{{
                            formatTime(item.comming_time) }}</span>
                        <span v-else class="text-base-content/50">-</span>
                    </td>
                    <td class="text-center">
                        <span v-if="computeLateTime(item.comming_time)" class="badge badge-warning badge-sm">{{
                            computeLateTime(item.comming_time) }}</span>
                        <span v-else class="text-base-content/50">-</span>
                    </td>
                    <td class="text-center">
                        <img v-if="item.image_snap" :src="`${imgProBaseUrl}${item.image_snap}`" alt="late snapshot"
                            class="w-16 h-16 object-cover rounded-md cursor-pointer inline-block"
                            @click="viewImage(item.image_snap)" />
                        <span v-else class="text-base-content/50">-</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="lg:hidden space-y-4">
        <div v-if="data.length === 0" class="text-center py-8 text-base-content/60 bg-base-100 rounded-lg shadow-lg">
            ไม่พบข้อมูล
        </div>
        <div v-for="item in data" :key="item._id" class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="flex items-start gap-3">
                <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                    class="w-10 h-10 rounded-full object-cover cursor-pointer" @click="viewImage(item.picture, true)"
                    @error="item.picture = null" />
                <div v-else class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                    <span class="text-base font-bold">{{ getInitials(item.name) }}</span>
                </div>
                <div class="flex-1">
                    <div class="badge badge-primary badge-sm mb-2">{{ item.userid }}</div>
                    <h3 class="font-bold text-lg">{{ item.name }}</h3>
                    <p class="text-sm text-base-content/70">{{ item.position }}</p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span class="text-base-content/60">ชั้นเรียน:</span>
                    <p class="font-medium" v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{ item.classroom }}</p>
                    <p class="font-medium" v-else>-</p>
                </div>
                <div>
                    <span class="text-base-content/60">เวลา:</span>
                    <p class="font-medium" v-if="item.comming_time">{{ formatTime(item.comming_time) }}</p>
                    <p class="font-medium" v-else>-</p>
                </div>
            </div>

            <div class="text-sm">
                <span class="text-base-content/60">เวลาสาย:</span>
                <p class="font-medium text-warning inline" v-if="computeLateTime(item.comming_time)">{{
                    computeLateTime(item.comming_time) }}</p>
                <p class="font-medium inline" v-else>-</p>
            </div>

            <img v-if="item.image_snap" :src="`${imgProBaseUrl}${item.image_snap}`" alt="late snapshot"
                class="w-full h-40 object-cover rounded-md cursor-pointer" @click="viewImage(item.image_snap)" />
        </div>
    </div>

    <div v-if="pagination.total_pages > 1" class="flex justify-center mt-6">
        <div class="join">
            <button class="join-item btn btn-sm bg-transparent border-none"
                @click="$emit('page-change', pagination.page - 1)" :disabled="pagination.page === 1">
                «
            </button>
            <button v-for="page in displayedPages" :key="page" class="join-item btn btn-sm bg-transparent border-none"
                :class="page === pagination.page ? 'bg-base-content/20 font-bold' : ''"
                @click="$emit('page-change', page)">
                {{ page }}
            </button>
            <button class="join-item btn btn-sm bg-transparent border-none"
                @click="$emit('page-change', pagination.page + 1)"
                :disabled="pagination.page === pagination.total_pages">
                »
            </button>
        </div>
    </div>

    <div v-if="pagination.total_items > 0" class="text-center text-sm text-base-content/60 mt-4 text-white">
        แสดง {{ ((pagination.page - 1) * pagination.limit) + 1 }} - {{
            Math.min(pagination.page * pagination.limit, pagination.total_items)
        }} จาก {{ pagination.total_items }} รายการ
    </div>

    <dialog ref="imageModal" class="modal">
        <div class="modal-box max-w-7xl w-full p-0">
            <form method="dialog">
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-white/80 hover:bg-white">✕</button>
            </form>
            <img v-if="selectedImage"
                :src="`${selectedImageType === 'profile' ? imgProBaseUrl : imgProBaseUrl}${selectedImage}`"
                alt="late image" class="w-full h-auto max-h-[90vh] object-contain" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
const loadingExport = ref(false)

import reportApi from '../../api/report.js'
async function exportLateToExcel() {
    if (loadingExport.value) return;
    loadingExport.value = true;
    try {
        const params = {
            date: props.filters?.date,
            role: props.filters?.role,
            page: 1,
            limit: props.pagination?.limit || 50,
        };
        if (props.grade !== undefined && props.grade !== null && props.grade !== '') params.grade = props.grade;
        if (props.classroom !== undefined && props.classroom !== null && props.classroom !== '') params.classroom = props.classroom;
        let allData = [];
        let totalPages = 1;
        do {
            const res = await reportApi.getLateReport(params);
            if (res && res.data) {
                allData = allData.concat(res.data);
                totalPages = res.total_pages || 1;
                params.page++;
            } else {
                break;
            }
        } while (params.page <= totalPages);

        const uniqueMap = new Map();
        allData.forEach(item => {
            if (!uniqueMap.has(item.userid)) {
                uniqueMap.set(item.userid, item);
            }
        });
        let uniqueData = Array.from(uniqueMap.values());

        if (props.grade !== undefined && props.grade !== null && props.grade !== '') {
            uniqueData = uniqueData.filter(item => String(item.grade) === String(props.grade));
        }
        if (props.classroom !== undefined && props.classroom !== null && props.classroom !== '') {
            uniqueData = uniqueData.filter(item => String(item.classroom) === String(props.classroom));
        }

        const rows = uniqueData.map(item => ({
            'รหัส': item.userid,
            'ชื่อ-สกุล': item.name,
            'ตำแหน่ง': item.position,
            'ชั้นเรียน/แผนก': item.position === 'นักเรียน'
                ? `${item.grade}/${item.classroom}`
                : (item.department || '-'),
            'เวลาเข้า': formatTime(item.comming_time),
            'มาสาย(ชม.)': computeLateTime(item.comming_time),
        }));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('LateDetail');

        let reportDate = '';
        if (props.filters && props.filters.date) {
            const [y, m, d] = props.filters.date.split('-');
            reportDate = `${d}/${m}/${y}`;
        } else {
            const now = new Date();
            reportDate = now.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
        worksheet.addRow([`รายงานข้อมูลมาสาย (${reportDate})`]);
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A1').font = { bold: true };

        const header = ['รหัส', 'ชื่อ-สกุล', 'ตำแหน่ง', 'ชั้นเรียน/แผนก', 'เวลาเข้า', 'มาสาย(ชม.)'];
        worksheet.addRow(header);

        rows.forEach(row => {
            worksheet.addRow(header.map(h => row[h]));
        });

        worksheet.columns = [
            { width: 10 },
            { width: 40 },
            { width: 20 },
            { width: 40 },
            { width: 15 },
            { width: 15 },
        ];
        worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(2).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `LateDetail.xlsx`);
    } catch (e) {
        alert('เกิดข้อผิดพลาดในการส่งออก Excel');
        console.error(e);
    } finally {
        loadingExport.value = false;
    }
}

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    pagination: {
        type: Object,
        required: true
    },
    filters: {
        type: Object,
        required: false
    },
    grade: {
        type: [String, Number],
        required: false,
        default: undefined
    },
    classroom: {
        type: [String, Number],
        required: false,
        default: undefined
    }
})

const emit = defineEmits(['page-change'])

// const imgBaseUrl = import.meta.env.VITE_APP_IMG_URL
const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const imageModal = ref(null)
const selectedImage = ref(null)
const selectedImageType = ref('snap')

const displayedPages = computed(() => {
    const total = props.pagination.total_pages
    const current = props.pagination.page
    const maxVisible = 5
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2))
    let endPage = Math.min(total, startPage + maxVisible - 1)
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }
    return pages
})

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const parts = timestamp.split(' ')
    if (parts.length < 2) return ''
    const timePart = parts[1]
    const [hStr, mStr] = timePart.split(':')
    return `${hStr}:${mStr}`
}

const computeLateTime = (timestamp) => {
    if (!timestamp) return ''
    const parts = timestamp.split(' ')
    if (parts.length < 2) return ''
    const timePart = parts[1]
    const [hStr, mStr, sStr] = timePart.split(':')
    const h = parseInt(hStr, 10)
    const m = parseInt(mStr, 10)
    if ([h, m].some(v => isNaN(v))) return ''
    const totalMinutes = h * 60 + m
    const baseMinutes = 8 * 60
    const diff = totalMinutes - baseMinutes
    if (diff <= 0) return ''
    const dh = Math.floor(diff / 60)
    const dm = diff % 60
    return `${String(dh).padStart(2, '0')}.${String(dm).padStart(2, '0')}`
}

const viewImage = (image, isProfile = false) => {
    selectedImage.value = image
    selectedImageType.value = isProfile ? 'profile' : 'snap'
    imageModal.value?.showModal()
}

const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 3) {
        return (parts[1][0] || '') + (parts[2][0] || '')
    }
    if (parts.length === 2) {
        return (parts[0][0] || '') + (parts[1][0] || '')
    }
    return parts[0][0] || '?'
}
</script>

<style scoped>
.join {
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
    background: #f8fafc;
}

.btn.bg-transparent {
    background: transparent;
}

.bg-base-content\/20 {
    background-color: #e5e7eb !important;
}
</style>