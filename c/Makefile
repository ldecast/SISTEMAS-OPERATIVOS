obj-m += kernel_.o
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd) modules
modulesclean:
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd) clean


