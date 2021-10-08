#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/seq_file.h>
#include <linux/proc_fs.h>
#include <linux/mm.h>
#include <linux/cpufreq.h>

void __attribute__((weak)) arch_report_meminfo(struct seq_file *m){}

static int my_proc_show(struct seq_file *m, void *v){
    struct sysinfo i;
    struct cpufreq_policy *cp;
    unsigned long uc_temp, tc_temp, um_temp, tm_temp;

    si_meminfo(&i); //info de memoria
    um_temp = i.totalram - i.freeram; //memoria usada
    tm_temp = i.totalram; //memoria total


    uc_temp = 0;
    tc_temp = 0;

    seq_printf(m, "{\n\t\"um_temp\":%lu,\n\t\"tm_temp\":%lu,\n\t\"uc_temp\":%lu,\n\t\"tc_temp\":%lu\n}\n", um_temp, tm_temp, uc_temp, tc_temp); //writing in JSON format in /proc/modulo file

    arch_report_meminfo(m);

    return 0;
}

static int my_proc_open(struct inode *inode, struct file *file){
    return single_open(file, my_proc_show, NULL);
}

static ssize_t my_proc_write(struct file *file, const char __user *buffer, size_t count, loff_t *f_pos){
    return 0;
}

static struct file_operations my_fops={
    .owner = THIS_MODULE,
    .open = my_proc_open,
    .release = single_release,
    .read = seq_read,
    .llseek = seq_lseek,
    .write = my_proc_write
};

static int __init modulo_init(void){
    struct proc_dir_entry *entry;
    entry = proc_create("modulo", 0777, NULL, &my_fops);
    if(!entry) {
        return -1;    
    } else {
        printk(KERN_INFO "Start\n");
    }
    return 0;
}

static void __exit modulo_exit(void){
    remove_proc_entry("modulo",NULL);
    printk(KERN_INFO "End\n");
}

module_init(modulo_init);
module_exit(modulo_exit);

