
import type { StepContent } from './types';

export const steps: StepContent[] = [
    {
        title: 'Prerequisites & Introduction',
        description: [
            "Welcome! This guide will walk you through cloning your Jetson's operating system from an SD card to an SSD, making it bootable.",
            "This process offers significant performance improvements. Before you begin, ensure you have the following:",
            "<ul class='list-disc list-inside ml-4'><li>Your NVIDIA Jetson device, booted from the SD card.</li><li>An SSD with enough capacity to hold your current OS.</li><li>A USB-to-SATA/NVMe adapter or enclosure to connect the SSD.</li></ul>",
        ],
        warning: "This process carries a risk of data loss if performed incorrectly. Please back up any critical data before proceeding."
    },
    {
        title: 'Connect SSD and Identify Drives',
        description: [
            "First, connect your SSD to the Jetson using your adapter. Once connected, open a terminal and run the following command to list all block storage devices.",
            "This will help you identify the device names for your SD card (the source) and your new SSD (the destination). Your SD card will likely be <code>mmcblk0</code> and your SSD will be something like <code>sda</code> or <code>nvme0n1</code>."
        ],
        command: "lsblk -p",
        note: "Look for the device that matches the size of your SSD. Note down the full path (e.g., /dev/sda) for both the source and destination drives. You will need them in the next step."
    },
    {
        title: 'Clone SD Card to SSD',
        description: [
            "Now we will perform a block-level copy from the SD card to the SSD using the <code>dd</code> command.",
            "Replace <code>/dev/source_drive</code> with your SD card's device path and <code>/dev/destination_drive</code> with your SSD's device path you identified in the previous step."
        ],
        command: "sudo dd if=/dev/source_drive of=/dev/destination_drive bs=4M conv=fsync status=progress",
        warning: "<strong>CRITICAL:</strong> The <code>dd</code> command is extremely powerful and can wipe your data permanently. <strong>TRIPLE-CHECK</strong> that <code>if=</code> is your SD card and <code>of=</code> is your new, empty SSD. An error here is irreversible."
    },
    {
        title: 'Identify New Root Partition UUID',
        description: [
            "After the clone finishes, the OS on the SSD still references the old SD card's unique identifier (UUID) for booting. We need to update this.",
            "First, run <code>lsblk -p</code> again to see the partitions on the new SSD. Find the main Linux root partition (it will be the largest one, e.g., <code>/dev/sda1</code>).",
            "Then, use the <code>blkid</code> command to get the UUID of this new partition. Replace <code>/dev/your_ssd_partition</code> with the correct path."

        ],
        command: "sudo blkid /dev/your_ssd_partition",
        note: "Copy the UUID value from the output (it's the long string in quotes after `UUID=`). You will need it in the next step."
    },
    {
        title: 'Update the Filesystem Table (fstab)',
        description: [
            "We need to mount the SSD's root partition to edit its <code>fstab</code> file.",
            "First, create a temporary mount point:",
        ],
        command: "sudo mkdir /mnt/ssd"
    },
    {
        title: "Mount and Edit fstab",
        description: [
            "Now mount the SSD's root partition to this new directory. Replace <code>/dev/your_ssd_partition</code> accordingly.",
        ],
        command: "sudo mount /dev/your_ssd_partition /mnt/ssd",
        note: "Once mounted, open the <code>fstab</code> file on the SSD using a text editor like nano: <code>sudo nano /mnt/ssd/etc/fstab</code>"
    },
    {
        title: 'Finalizing the fstab Edit',
        description: [
            "Inside the nano editor, you will see a line for the root filesystem (<code>/</code>). It will have the old SD card's UUID.",
            "Carefully delete the old UUID and paste the <strong>new SSD partition's UUID</strong> you copied earlier. The line should look something like this:",
            "<code>UUID=...your-new-ssd-uuid-here...  /  ext4  errors=remount-ro  0  1</code>",
            "After editing, press <code>Ctrl+X</code>, then <code>Y</code>, then <code>Enter</code> to save the file and exit nano."
        ],
        warning: "This step is crucial for the SSD to be bootable. Ensure you are editing <code>/mnt/ssd/etc/fstab</code> and not the system's live <code>/etc/fstab</code>."
    },
    {
        title: 'Unmount and Shutdown',
        description: [
            "The hard part is over! Now, unmount the SSD partition.",
        ],
        command: "sudo umount /mnt/ssd"
    },
    {
        title: 'Boot from SSD',
        description: [
            "Finally, shut down your Jetson completely.",
            "<strong>Important:</strong> Once it's powered off, remove the original SD card.",
            "Now, power on your Jetson. It should automatically boot from the newly cloned SSD! You can verify this by running <code>lsblk</code> again; you will see that the root mount point <code>/</code> is on your SSD device.",
            "Congratulations on your successful OS migration!"
        ],
        note: "The first boot from the SSD might be slightly longer as the system adjusts. Enjoy the performance boost!"
    }
];
