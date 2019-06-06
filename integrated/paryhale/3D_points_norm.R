## add packages
library(scatterplot3d)
library(rgl)

## set working directory
setwd("~/Desktop/visualisation/integrated/paryhale/")

## open original coords
cells_3D <- read.table(file = "3D_coords.txt")

## give column names
colnames(cells_3D) <- c("cell", "X", "Y", "Z")
head(cells_3D)
cells_3D$cell <- paste("x", cells_3D$cell,sep = "")

## Fins max range for all the dimensions and normalise
my_max <- max(c(
            (max(cells_3D$X) - min(cells_3D$X)),
            (max(cells_3D$Y) - min(cells_3D$Y)),
            (max(cells_3D$Z) - min(cells_3D$Z))))

cells_3D$Xnorm <- cells_3D$X/my_max
cells_3D$Ynorm <- cells_3D$Y/my_max
cells_3D$Znorm <- cells_3D$Z/my_max


## find the centroid of the cells
centroid <- c(sum(cells_3D$Xnorm)/length(cells_3D$Xnorm), 0.5,
#              sum(cells_3D$Ynorm)/length(cells_3D$Ynorm),  # this one is diff
              sum(cells_3D$Znorm)/length(cells_3D$Znorm))


cells_3D$Xnorm <- cells_3D$Xnorm - centroid[1]
cells_3D$Ynorm <- cells_3D$Ynorm + centroid[2]
cells_3D$Znorm <- cells_3D$Znorm - centroid[3]


scatterplot3d(x = cells_3D$X, y = cells_3D$Y, z = cells_3D$Z, color = "blue")

plot3d(x = cells_3D$X, y = cells_3D$Y, z = cells_3D$Z,
       col = "blue", size = 5)

plot3d(x = cells_3D$Xnorm, y = cells_3D$Ynorm, z = cells_3D$Znorm, 
 #      xlim = c(-0.5,0.5), ylim=c(0,1), zlim=c(-0.5,0.5), 
       col = "blue",size = 6 )


write.csv(x = cells_3D, file = "cells_3Dnorm_centroid.csv", row.names = F)
