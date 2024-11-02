package info.seltenheim.ssponline;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

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
