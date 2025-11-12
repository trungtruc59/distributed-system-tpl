<template>
    <div class="w-full bg-white" style="user-select: none">
        <div class="w-full">
            <!-- Header -->
            <div class="flex">
                <div class="w-12 flex-shrink-0"></div>
                <div class="flex flex-1 relative pb-6">
                    <div v-for="(slot, i) in timeSlots.slice(0, -1)" :key="i" class="flex-1 relative">
                        <span v-if="i % (60 / timeScale) === 0" class="absolute text-xs text-gray-600" style="left: 0; top: 0; transform: translateX(-50%)">
                            {{ formatTime(slot) }}
                        </span>
                        <div v-if="i % (60 / timeScale) === 0" class="absolute border-l border-gray-300" style="left: 0; top: 1.25rem; height: 0.5rem"></div>
                    </div>
                    <!-- Last time marker -->
                    <div class="text-xs text-gray-600 absolute" style="right: 0; transform: translateX(50%); top: 0">
                        {{ formatTime(timeSlots[timeSlots.length - 1]) }}
                    </div>
                    <div class="absolute border-l border-gray-300" style="right: 0; top: 1.25rem; height: 0.5rem"></div>
                </div>
            </div>

            <!-- Grid -->
            <div ref="gridRef">
                <div v-for="(item, rowIndex) in displayItems" :key="rowIndex" class="flex border-b border-gray-200">
                    <div class="w-12 flex-shrink-0 flex items-center justify-center text-sm font-medium bg-gray-50 border-r border-gray-300">
                        {{ item.name }}
                    </div>
                    <div class="flex flex-1 relative h-10">
                        <div
                            v-for="(slot, slotIndex) in timeSlots.slice(0, -1)"
                            :key="slotIndex"
                            :class="[
                                'h-full transition-colors flex-1 relative',
                                isSlotDisabled(rowIndex, slotIndex) ? 'cursor-not-allowed' : 'cursor-pointer',
                                isSlotInDragRange(rowIndex, slotIndex) && !isSlotDisabled(rowIndex, slotIndex) ? 'bg-blue-200' : '',
                            ]"
                            :style="{
                                backgroundColor: getSlotBackgroundColor(rowIndex, slotIndex),
                                borderLeft: slotIndex % (60 / timeScale) === 0 ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                            }"
                            @mousedown="(e) => handleMouseDown(rowIndex, slotIndex, e)"
                            @mouseenter="() => handleMouseEnter(slotIndex)"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

    const props = defineProps({
        start: {
            type: String,
            default: '2025-01-01T06:00:00',
        },
        end: {
            type: String,
            default: '2025-01-01T22:00:00',
        },
        timeScale: {
            type: Number,
            default: 30,
        },
        items: {
            type: Array,
            default: () => [],
        },
        labels: {
            type: Array,
            default: () => [],
        },
        clearLine: {
            type: Boolean,
            default: false,
        },
        selectColor: {
            type: String,
            default: '#ff6666',
        },
        disabledDays: {
            type: Function,
            default: null,
        },
    });

    const emit = defineEmits(['change']);

    const localItems = ref([...props.items]);
    const isDragging = ref(false);
    const dragStart = ref(null);
    const dragEnd = ref(null);
    const currentRow = ref(null);
    const gridRef = ref(null);

    const displayItems = computed(() => {
        if (props.labels.length === 0) {
            return localItems.value;
        }

        return props.labels.map((label) => {
            const existingItem = localItems.value.find((item) => item.name === label);
            return existingItem || { name: label, periods: [] };
        });
    });

    watch(
        () => props.items,
        (newItems) => {
            localItems.value = [...newItems];
        },
        { deep: true }
    );

    const parseDateTime = (dateTimeStr) => {
        return new Date(dateTimeStr);
    };

    const timeSlots = computed(() => {
        const startDate = parseDateTime(props.start);
        const endDate = parseDateTime(props.end);
        const totalMinutes = (endDate - startDate) / (1000 * 60);
        const slotCount = Math.floor(totalMinutes / props.timeScale) + 1;

        return Array.from({ length: slotCount }, (_, i) => {
            const date = new Date(startDate);
            date.setMinutes(date.getMinutes() + i * props.timeScale);
            return date;
        });
    });

    const headerSlots = computed(() => {
        return timeSlots.value.filter((_, i) => i % (60 / props.timeScale) === 0);
    });

    const formatTime = (date) => {
        return date.toTimeString().slice(0, 5);
    };

    const getSlotIndex = (time) => {
        const startDate = parseDateTime(props.start);
        const timeDate = parseDateTime(`${props.start.split('T')[0]}T${time}:00`);
        const diff = (timeDate - startDate) / (1000 * 60);
        return Math.floor(diff / props.timeScale);
    };

    const getTimeFromIndex = (index) => {
        const startDate = parseDateTime(props.start);
        const newDate = new Date(startDate);
        newDate.setMinutes(newDate.getMinutes() + index * props.timeScale);
        return formatTime(newDate);
    };

    const getPeriodAtSlot = (rowIndex, slotIndex) => {
        const item = displayItems.value[rowIndex];
        if (!item || !item.periods) return null;

        return item.periods.find((period) => {
            const startIdx = getSlotIndex(period.start);
            const endIdx = getSlotIndex(period.end);
            return slotIndex >= startIdx && slotIndex < endIdx;
        });
    };

    const isSlotDisabled = (rowIndex, slotIndex) => {
        const period = getPeriodAtSlot(rowIndex, slotIndex);
        if (period?.disabled === true) return true;

        if (props.disabledDays && slotIndex < timeSlots.value.length) {
            const slotDate = timeSlots.value[slotIndex];
            return props.disabledDays(slotDate);
        }

        return false;
    };

    const isSlotInDragRange = (rowIndex, slotIndex) => {
        if (!isDragging.value || currentRow.value !== rowIndex || dragStart.value === null || dragEnd.value === null) {
            return false;
        }
        const min = Math.min(dragStart.value, dragEnd.value);
        const max = Math.max(dragStart.value, dragEnd.value);
        return slotIndex >= min && slotIndex <= max;
    };

    const getSlotBackgroundColor = (rowIndex, slotIndex) => {
        if (isSlotInDragRange(rowIndex, slotIndex) && !isSlotDisabled(rowIndex, slotIndex)) {
            return undefined;
        }

        const period = getPeriodAtSlot(rowIndex, slotIndex);
        if (period) {
            if (period.disabled || isSlotDisabled(rowIndex, slotIndex)) {
                return period.color ? `${period.color}80` : `${props.selectColor}80`;
            }
            return period.color || props.selectColor;
        }

        if (isSlotDisabled(rowIndex, slotIndex)) {
            return '#f3f4f6';
        }

        return undefined;
    };

    const handleMouseDown = (rowIndex, slotIndex, e) => {
        if (isSlotDisabled(rowIndex, slotIndex)) return;

        e.preventDefault();
        isDragging.value = true;
        dragStart.value = slotIndex;
        dragEnd.value = slotIndex;
        currentRow.value = rowIndex;
    };

    const handleMouseEnter = (slotIndex) => {
        if (isDragging.value) {
            dragEnd.value = slotIndex;
        }
    };

    const handleMouseUp = () => {
        if (isDragging.value && dragStart.value !== null && dragEnd.value !== null && currentRow.value !== null) {
            const startIdx = Math.min(dragStart.value, dragEnd.value);
            const endIdx = Math.max(dragStart.value, dragEnd.value) + 1;

            const currentItem = displayItems.value[currentRow.value];
            const itemName = currentItem.name;

            const newItems = [...localItems.value];
            let itemIndex = newItems.findIndex((item) => item.name === itemName);

            let item;
            if (itemIndex === -1) {
                item = { name: itemName, periods: [] };
                newItems.push(item);
                itemIndex = newItems.length - 1;
            } else {
                item = { ...newItems[itemIndex] };
            }

            if (!item.periods) {
                item.periods = [];
            } else {
                item.periods = [...item.periods];
            }

            const startTime = getTimeFromIndex(startIdx);
            const endTime = getTimeFromIndex(endIdx);

            const hasDisabled = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i).some((i) => isSlotDisabled(currentRow.value, i));

            if (hasDisabled) {
                isDragging.value = false;
                dragStart.value = null;
                dragEnd.value = null;
                currentRow.value = null;
                return;
            }

            const isRemoving = displayItems.value[currentRow.value].periods?.some((period) => {
                if (period.disabled) return false;

                const pStart = getSlotIndex(period.start);
                const pEnd = getSlotIndex(period.end);
                return startIdx >= pStart && endIdx <= pEnd;
            });

            if (isRemoving) {
                if (props.clearLine) {
                    item.periods = item.periods.filter((period) => {
                        if (period.disabled) return true;

                        const pStart = getSlotIndex(period.start);
                        const pEnd = getSlotIndex(period.end);
                        return !(startIdx >= pStart && endIdx <= pEnd);
                    });
                } else {
                    const newPeriods = [];

                    displayItems.value[currentRow.value].periods.forEach((period) => {
                        if (period.disabled) {
                            newPeriods.push(period);
                            return;
                        }

                        const pStart = getSlotIndex(period.start);
                        const pEnd = getSlotIndex(period.end);

                        if (pEnd <= startIdx || pStart >= endIdx) {
                            newPeriods.push(period);
                        } else if (startIdx > pStart && endIdx < pEnd) {
                            newPeriods.push({
                                start: period.start,
                                end: getTimeFromIndex(startIdx),
                                color: period.color,
                            });
                            newPeriods.push({
                                start: getTimeFromIndex(endIdx),
                                end: period.end,
                                color: period.color,
                            });
                        } else if (startIdx <= pStart && endIdx < pEnd) {
                            newPeriods.push({
                                start: getTimeFromIndex(endIdx),
                                end: period.end,
                                color: period.color,
                            });
                        } else if (startIdx > pStart && endIdx >= pEnd) {
                            newPeriods.push({
                                start: period.start,
                                end: getTimeFromIndex(startIdx),
                                color: period.color,
                            });
                        }
                    });

                    item.periods = newPeriods;
                }
            } else {
                item.periods = item.periods.filter((period) => {
                    if (period.disabled) return true;

                    const pStart = getSlotIndex(period.start);
                    const pEnd = getSlotIndex(period.end);
                    return pEnd <= startIdx || pStart >= endIdx;
                });

                item.periods.push({
                    start: startTime,
                    end: endTime,
                    color: props.selectColor,
                });

                item.periods.sort((a, b) => getSlotIndex(a.start) - getSlotIndex(b.start));

                const merged = item.periods.reduce((acc, period) => {
                    if (period.disabled) {
                        acc.push(period);
                        return acc;
                    }

                    if (acc.length === 0 || acc[acc.length - 1].disabled) {
                        acc.push(period);
                    } else {
                        const last = acc[acc.length - 1];
                        if (getSlotIndex(last.end) === getSlotIndex(period.start) && last.color === period.color) {
                            last.end = period.end;
                        } else {
                            acc.push(period);
                        }
                    }
                    return acc;
                }, []);

                item.periods = merged;
            }

            newItems[itemIndex] = item;
            localItems.value = newItems;
            emit('change', newItems);
        }

        isDragging.value = false;
        dragStart.value = null;
        dragEnd.value = null;
        currentRow.value = null;
    };

    const handleGlobalMouseUp = () => {
        if (isDragging.value) {
            handleMouseUp();
        }
    };

    onMounted(() => {
        document.addEventListener('mouseup', handleGlobalMouseUp);
    });

    onUnmounted(() => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
    });
</script>

<style scoped></style>
