#include<stdio.h>

int main() {
  FILE *fp;
  int inc = 0;

  fp = fopen("./input.txt", "r");

  int prev = 0;

  for (int i = 0; i < 2000; i++) {
    int cur;
    fscanf(fp, "%d", &cur);

    if (i != 0) {
      if (cur > prev) {
        inc++;
      }

      prev = cur;
    }
  }

  fclose(fp);

  printf("inc=%d\n", inc);

  return 0;
}
