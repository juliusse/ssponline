package info.seltenheim.ssponline;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@Getter
@Setter
@MappedSuperclass
public class DbModel {
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private long createdAt;

    @Column(name = "modified_at")
    @LastModifiedDate
    private long modifiedAt;
}
